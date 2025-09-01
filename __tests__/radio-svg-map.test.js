import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FakeMap from './fake-map';
import { RadioSVGMap } from '../src';

describe('RadioSVGMap component', () => {
	describe('Navigation', () => {
		let location1;
		let location2;
		let location3;

		beforeEach(() => {
			render(<RadioSVGMap map={FakeMap} />);
			location1 = screen.getByRole('radio', { name: 'name0' });
			location2 = screen.getByRole('radio', { name: 'name1' });
			location3 = screen.getByRole('radio', { name: 'name2' });
		});

		describe('Mouse', () => {
			test('selects location when clicking on not yet selected location', async () => {
				const user = userEvent.setup();
				expect(location1).not.toBeChecked();
				await user.click(location1);
				expect(location1).toBeChecked();
			});

			test('does not deselect location when clicking on already selected location', async () => {
				const user = userEvent.setup();
				await user.click(location1);
				expect(location1).toBeChecked();
				await user.click(location1);
				expect(location1).toBeChecked();
			});

			test('selects new location and deselects former selected when clicking on new location', async () => {
				const user = userEvent.setup();
				await user.click(location1);
				expect(location1).toBeChecked();
				expect(location2).not.toBeChecked();

				await user.click(location2);
				expect(location1).not.toBeChecked();
				expect(location2).toBeChecked();
			});

			test('makes location focusable when selected', async () => {
				const user = userEvent.setup();
				// Initially, only the first location is focusable
				expect(location1).toHaveAttribute('tabindex', '0');
				expect(location2).toHaveAttribute('tabindex', '-1');

				await user.click(location2);
				expect(location1).toHaveAttribute('tabindex', '-1');
				expect(location2).toHaveAttribute('tabindex', '0');
			});
		});

		describe('Keyboard', () => {
			test('selects focused not yet selected location when hitting spacebar', () => {
				expect(location2).not.toBeChecked();
				location2.focus();
				fireEvent.keyDown(location2, { keyCode: 32 });
				expect(location2).toBeChecked();
			});

			test('does not deselect focused already selected location when hitting spacebar', () => {
				location2.focus();
				fireEvent.keyDown(location2, { keyCode: 32 });
				expect(location2).toBeChecked();
				fireEvent.keyDown(location2, { keyCode: 32 });
				expect(location2).toBeChecked();
			});

			test('selects next location when hitting down/right arrow', () => {
				location1.focus();
				fireEvent.keyDown(location1, { keyCode: 40 }); // ArrowDown
				expect(location2).toBeChecked();
				fireEvent.keyDown(location2, { keyCode: 39 }); // ArrowRight
				expect(location3).toBeChecked();
			});

			test('selects previous location when hitting up/left arrow', () => {
				location1.focus();
				fireEvent.keyDown(location1, { keyCode: 38 }); // ArrowUp
				expect(location3).toBeChecked();
				fireEvent.keyDown(location3, { keyCode: 37 }); // ArrowLeft
				expect(location2).toBeChecked();
			});
		});
	});

	describe('Communication', () => {
		const handleOnChange = jest.fn();

		beforeEach(() => {
			handleOnChange.mockClear();
		});

		test('selects initial location when id is provided', () => {
			render(<RadioSVGMap map={FakeMap} selectedLocationId="id1" />);
			const location2 = screen.getByRole('radio', { name: 'name1' });
			expect(location2).toBeChecked();
		});

		test('calls onChange handler when selecting location', async () => {
			const user = userEvent.setup();
			render(<RadioSVGMap map={FakeMap} onChange={handleOnChange} />);
			const location2 = screen.getByRole('radio', { name: 'name1' });
			await user.click(location2);
			expect(handleOnChange).toHaveBeenCalledTimes(1);
			expect(handleOnChange.mock.calls[0][0].id).toBe('id1');
		});

		test('does not call onChange handler when clicking on already selected location', async () => {
			const user = userEvent.setup();
			render(<RadioSVGMap map={FakeMap} selectedLocationId="id1" onChange={handleOnChange} />);
			const location2 = screen.getByRole('radio', { name: 'name1' });
			await user.click(location2);
			expect(handleOnChange).toHaveBeenCalledTimes(1); // Only called on mount
		});
	});

	describe('Rendering', () => {
		test('displays map with default props', () => {
			const { asFragment } = render(<RadioSVGMap map={FakeMap} />);
			expect(asFragment()).toMatchSnapshot();
		});

		test('displays map with custom props', () => {
			const eventHandler = jest.fn();
			const { asFragment } = render(
				<RadioSVGMap
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