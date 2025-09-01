import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FakeMap from './fake-map';
import { CheckboxSVGMap } from '../src';

describe('CheckboxSVGMap component', () => {
	describe('Navigation', () => {
		let location;

		beforeEach(() => {
			render(<CheckboxSVGMap map={FakeMap} />);
			location = screen.getByRole('checkbox', { name: 'name0' });
		});

		describe('Mouse', () => {
			test('selects location when clicking on not yet selected location', async () => {
				const user = userEvent.setup();
				expect(location).not.toBeChecked();
				await user.click(location);
				expect(location).toBeChecked();
			});

			test('deselects location when clicking on already selected location', async () => {
				const user = userEvent.setup();
				await user.click(location);
				expect(location).toBeChecked();
				await user.click(location);
				expect(location).not.toBeChecked();
			});
		});

		describe('Keyboard', () => {
			test('selects focused location when hitting spacebar', () => {
				expect(location).not.toBeChecked();
				location.focus();
				fireEvent.keyDown(location, { keyCode: 32 });
				expect(location).toBeChecked();
			});

			test('does not select focused location when hitting other key', () => {
				expect(location).not.toBeChecked();
				location.focus();
				fireEvent.keyDown(location, { keyCode: 31 });
				expect(location).not.toBeChecked();
			});

			test('deselects focused already selected location when hitting spacebar', () => {
				location.focus();
				fireEvent.keyDown(location, { keyCode: 32 });
				expect(location).toBeChecked();
				fireEvent.keyDown(location, { keyCode: 32 });
				expect(location).not.toBeChecked();
			});
		});
	});

	describe('Communication', () => {
		const handleOnChange = jest.fn();
		let selectedLocation;
		let otherSelectedLocation;
		let unselectedLocation;

		beforeEach(() => {
			handleOnChange.mockClear();
			render(
				<CheckboxSVGMap
					map={FakeMap}
					selectedLocationIds={['id0', 'id1']}
					onChange={handleOnChange}
				/>
			);
			selectedLocation = screen.getByRole('checkbox', { name: 'name0' });
			otherSelectedLocation = screen.getByRole('checkbox', { name: 'name1' });
			unselectedLocation = screen.getByRole('checkbox', { name: 'name2' });
		});

		test('selects initial locations when valid ids are provided', () => {
			expect(selectedLocation).toBeChecked();
			expect(otherSelectedLocation).toBeChecked();
			expect(unselectedLocation).not.toBeChecked();
		});

		test('calls onChange handler when selecting location', async () => {
			const user = userEvent.setup();
			await user.click(unselectedLocation);
			expect(handleOnChange).toHaveBeenCalledTimes(2); // Once on mount, once on click
			// The argument to onChange is an array of DOM nodes, so we check the length and ids
			const lastCallArgs = handleOnChange.mock.calls[1][0];
			expect(lastCallArgs).toHaveLength(3);
			expect(lastCallArgs.map(node => node.id)).toEqual(expect.arrayContaining(['id0', 'id1', 'id2']));
		});

		test('calls onChange handler when deselecting location', async () => {
			const user = userEvent.setup();
			await user.click(otherSelectedLocation);
			expect(handleOnChange).toHaveBeenCalledTimes(2); // Once on mount, once on click
			const lastCallArgs = handleOnChange.mock.calls[1][0];
			expect(lastCallArgs).toHaveLength(1);
			expect(lastCallArgs[0].id).toBe('id0');
		});
	});

	describe('Rendering', () => {
		test('displays map with default props', () => {
			const { asFragment } = render(<CheckboxSVGMap map={FakeMap} />);
			expect(asFragment()).toMatchSnapshot();
		});

		test('displays map with custom props', () => {
			const eventHandler = jest.fn();
			const { asFragment } = render(
				<CheckboxSVGMap
					map={FakeMap}
					className="className"
					locationClassName="locationClassName"
					onLocationMouseOver={eventHandler}
					onLocationMouseOut={eventHandler}
					onLocationMouseMove={eventHandler}
					onLocationFocus={eventHandler}
					onLocationBlur={eventHandler}
					onChange={eventHandler}
					childrenBefore={<text>childrenBefore</text>}
					childrenAfter={<text>childrenAfter</text>}
				/>
			);
			expect(asFragment()).toMatchSnapshot();
		});
	});
});