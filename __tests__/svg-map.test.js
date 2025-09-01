import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FakeMap from './fake-map';
import { SVGMap } from '../src/';

describe('SVGMap component', () => {
	describe('Properties', () => {
		test('displays map with default props', () => {
			const { asFragment } = render(<SVGMap map={FakeMap} />);
			expect(asFragment()).toMatchSnapshot();
		});

		test('displays map with custom props', () => {
			const eventHandler = jest.fn();
			const isLocationSelected = () => true;
			const { asFragment } = render(
				<SVGMap
					map={FakeMap}
					className="className"
					role="role"
					locationClassName="locationClassName"
					locationTabIndex="locationTabIndex"
					locationRole="locationRole"
					onLocationMouseOver={eventHandler}
					onLocationMouseOut={eventHandler}
					onLocationMouseMove={eventHandler}
					onLocationClick={eventHandler}
					onLocationKeyDown={eventHandler}
					onLocationFocus={eventHandler}
					onLocationBlur={eventHandler}
					isLocationSelected={isLocationSelected}
					childrenBefore={<text>childrenBefore</text>}
					childrenAfter={<text>childrenAfter</text>}
				/>
			);
			
			expect(asFragment()).toMatchSnapshot();
		});

		test('displays map with custom function location props', () => {
			const locationClassName = (location, index) => `locationClassName-${index}`;
			const locationTabIndex = (location, index) => `locationTabIndex-${index}`;
			const locationAriaLabel = (location, index) => `${location.name}-${index}`;
			const { asFragment } = render(
				<SVGMap
					map={FakeMap}
					locationClassName={locationClassName}
					locationTabIndex={locationTabIndex}
					locationAriaLabel={locationAriaLabel}
				/>
			);
			
			expect(asFragment()).toMatchSnapshot();
		});
	});

	describe('Events', () => {
		test('calls event handlers', () => {
			const onLocationMouseOver = jest.fn();
			const onLocationMouseOut = jest.fn();
			const onLocationMouseMove = jest.fn();
			const onLocationClick = jest.fn();
			const onLocationKeyDown = jest.fn();
			const onLocationFocus = jest.fn();
			const onLocationBlur = jest.fn();

			render(
				<SVGMap
					map={FakeMap}
					onLocationMouseOver={onLocationMouseOver}
					onLocationMouseOut={onLocationMouseOut}
					onLocationMouseMove={onLocationMouseMove}
					onLocationClick={onLocationClick}
					onLocationKeyDown={onLocationKeyDown}
					onLocationFocus={onLocationFocus}
					onLocationBlur={onLocationBlur}
				/>
			);

			const location = screen.getByRole('none', { name: 'name0' });

			fireEvent.mouseOver(location);
			expect(onLocationMouseOver).toHaveBeenCalledTimes(1);

			fireEvent.mouseOut(location);
			expect(onLocationMouseOut).toHaveBeenCalledTimes(1);

			fireEvent.mouseMove(location);
			expect(onLocationMouseMove).toHaveBeenCalledTimes(1);

			fireEvent.click(location);
			expect(onLocationClick).toHaveBeenCalledTimes(1);

			fireEvent.keyDown(location);
			expect(onLocationKeyDown).toHaveBeenCalledTimes(1);

			fireEvent.focus(location);
			expect(onLocationFocus).toHaveBeenCalledTimes(1);

			fireEvent.blur(location);
			expect(onLocationBlur).toHaveBeenCalledTimes(1);
		});
	});
});