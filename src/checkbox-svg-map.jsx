import React from 'react';
import PropTypes from 'prop-types';
import SVGMap from './svg-map';

class CheckboxSVGMap extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedLocationIds: props.selectedLocationIds || []
		};

		this.svgMapRef = React.createRef();
		this.isLocationSelected = this.isLocationSelected.bind(this);
		this.handleLocationClick = this.handleLocationClick.bind(this);
		this.handleLocationKeyDown = this.handleLocationKeyDown.bind(this);
	}

	componentDidMount() {
		// To handle initial selection if provided
		if (this.props.onChange) {
			const initialSelectedLocations = this.state.selectedLocationIds
				.map(id => this.svgMapRef.current.querySelector(`#${id}`))
				.filter(Boolean);
			this.props.onChange(initialSelectedLocations);
		}
	}

	isLocationSelected(location) {
		return this.state.selectedLocationIds.includes(location.id);
	}

	toggleLocation(locationId) {
		this.setState(prevState => {
			const selectedLocationIds = [...prevState.selectedLocationIds];
			const locationIndex = selectedLocationIds.indexOf(locationId);

			if (locationIndex !== -1) {
				selectedLocationIds.splice(locationIndex, 1);
			} else {
				selectedLocationIds.push(locationId);
			}

			if (this.props.onChange) {
				const selectedLocations = selectedLocationIds
					.map(id => this.svgMapRef.current.querySelector(`#${id}`))
					.filter(Boolean);
				this.props.onChange(selectedLocations);
			}

			return { selectedLocationIds };
		});
	}

	handleLocationClick(event) {
		event.preventDefault();
		const locationId = event.target.id;
		this.toggleLocation(locationId);
	}

	handleLocationKeyDown(event) {
		if (event.keyCode === 32) { // Spacebar
			event.preventDefault();
			const locationId = event.target.id;
			this.toggleLocation(locationId);
		}
	}

	render() {
		return (
			<div ref={this.svgMapRef}>
				<SVGMap
					map={this.props.map}
					role="group"
					locationRole="checkbox"
					locationTabIndex="0"
					className={this.props.className}
					locationClassName={this.props.locationClassName}
					locationAriaLabel={this.props.locationAriaLabel}
					isLocationSelected={this.isLocationSelected}
					onLocationClick={this.handleLocationClick}
					onLocationKeyDown={this.handleLocationKeyDown}
					onLocationMouseOver={this.props.onLocationMouseOver}
					onLocationMouseOut={this.props.onLocationMouseOut}
					onLocationMouseMove={this.props.onLocationMouseMove}
					onLocationFocus={this.props.onLocationFocus}
					onLocationBlur={this.props.onLocationBlur}
					childrenBefore={this.props.childrenBefore}
					childrenAfter={this.props.childrenAfter}
				/>
			</div>
		);
	}
}

CheckboxSVGMap.propTypes = {
	selectedLocationIds: PropTypes.arrayOf(PropTypes.string),
	onChange: PropTypes.func,
	map: PropTypes.shape({
		viewBox: PropTypes.string.isRequired,
		locations: PropTypes.arrayOf(
			PropTypes.shape({
				path: PropTypes.string.isRequired,
				name: PropTypes.string,
				id: PropTypes.string
			})
		).isRequired,
		label: PropTypes.string
	}).isRequired,
	className: PropTypes.string,
	locationClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
	locationAriaLabel: PropTypes.func,
	onLocationMouseOver: PropTypes.func,
	onLocationMouseOut: PropTypes.func,
	onLocationMouseMove: PropTypes.func,
	onLocationFocus: PropTypes.func,
	onLocationBlur: PropTypes.func,
	childrenBefore: PropTypes.node,
	childrenAfter: PropTypes.node,
};

export default CheckboxSVGMap;