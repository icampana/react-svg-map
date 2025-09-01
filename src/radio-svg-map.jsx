import React from 'react';
import PropTypes from 'prop-types';
import SVGMap from './svg-map';

class RadioSVGMap extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedLocationId: props.selectedLocationId || null
		};

		this.svgMapRef = React.createRef();
		this.locations = [];
		this.getLocationTabIndex = this.getLocationTabIndex.bind(this);
		this.isLocationSelected = this.isLocationSelected.bind(this);
		this.handleLocationClick = this.handleLocationClick.bind(this);
		this.handleLocationKeyDown = this.handleLocationKeyDown.bind(this);
	}

	componentDidMount() {
		this.locations = [...this.svgMapRef.current.querySelectorAll('path')];
		if (this.props.onChange && this.state.selectedLocationId) {
			const initialSelectedLocation = this.locations.find(loc => loc.id === this.state.selectedLocationId);
			if (initialSelectedLocation) {
				this.props.onChange(initialSelectedLocation);
			}
		}
	}

	getLocationTabIndex(location) {
		if (this.state.selectedLocationId) {
			return this.isLocationSelected(location) ? '0' : '-1';
		} else {
			// If no location is selected, make the first one focusable
			return this.props.map.locations[0].id === location.id ? '0' : '-1';
		}
	}

	isLocationSelected(location) {
		return this.state.selectedLocationId === location.id;
	}

	selectLocation(locationId) {
		const newSelectedLocation = this.locations.find(loc => loc.id === locationId);
		if (newSelectedLocation && newSelectedLocation.id !== this.state.selectedLocationId) {
			this.setState({ selectedLocationId: newSelectedLocation.id }, () => {
				newSelectedLocation.focus();
				if (this.props.onChange) {
					this.props.onChange(newSelectedLocation);
				}
			});
		}
	}

	handleLocationClick(event) {
		event.preventDefault();
		this.selectLocation(event.target.id);
	}

	handleLocationKeyDown(event) {
		const focusedLocationId = event.target.id;
		const focusedLocationIndex = this.locations.findIndex(loc => loc.id === focusedLocationId);

		if (event.keyCode === 32) { // Spacebar
			event.preventDefault();
			this.selectLocation(focusedLocationId);
		} else if (event.keyCode === 39 || event.keyCode === 40) { // Arrow down or right
			event.preventDefault();
			const nextLocationIndex = (focusedLocationIndex + 1) % this.locations.length;
			this.selectLocation(this.locations[nextLocationIndex].id);
		} else if (event.keyCode === 37 || event.keyCode === 38) { // Arrow up or left
			event.preventDefault();
			const prevLocationIndex = (focusedLocationIndex - 1 + this.locations.length) % this.locations.length;
			this.selectLocation(this.locations[prevLocationIndex].id);
		}
	}

	render() {
		return (
			<div ref={this.svgMapRef}>
				<SVGMap
					map={this.props.map}
					role="radiogroup"
					locationTabIndex={this.getLocationTabIndex}
					locationRole="radio"
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
				/>
			</div>
		);
	}
}

RadioSVGMap.propTypes = {
	selectedLocationId: PropTypes.string,
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

export default RadioSVGMap;