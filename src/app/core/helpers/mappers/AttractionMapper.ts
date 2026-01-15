export class AttractionTypeMapper {
  private static readonly TYPE_MAP: Record<string, string> = {
    // Google Maps Places Types
    'tourist_attraction': 'Tourist Attraction',
    'point_of_interest': 'Point of Interest',
    'museum': 'Museum',
    'art_gallery': 'Art Gallery',
    'landmark': 'Landmark',
    'park': 'Park',
    'natural_feature': 'Natural Feature',
    'zoo': 'Zoo',
    'aquarium': 'Aquarium',
    'amusement_park': 'Amusement Park',
    'casino': 'Casino',
    'church': 'Church',
    'mosque': 'Mosque',
    'synagogue': 'Synagogue',
    'temple': 'Temple',
    'hindu_temple': 'Hindu Temple',
    'cemetery': 'Cemetery',
    'city_hall': 'City Hall',
    'courthouse': 'Courthouse',
    'fire_station': 'Fire Station',
    'library': 'Library',
    'police': 'Police Station',
    'post_office': 'Post Office',
    'primary_school': 'Primary School',
    'secondary_school': 'Secondary School',
    'university': 'University',
    'hospital': 'Hospital',
    'pharmacy': 'Pharmacy',
    'doctor': 'Doctor',
    'dentist': 'Dentist',
    'restaurant': 'Restaurant',
    'cafe': 'Café',
    'bar': 'Bar',
    'night_club': 'Night Club',
    'shopping_mall': 'Shopping Mall',
    'store': 'Store',
    'supermarket': 'Supermarket',
    'hotel': 'Hotel',
    'hostel': 'Hostel',
    'campground': 'Campground',
    'lodging': 'Lodging',
    'movie_theater': 'Movie Theater',
    'stadium': 'Stadium',
    'sports_complex': 'Sports Complex',
    'gym': 'Gym',
    'swimming_pool': 'Swimming Pool',
    'bridge': 'Bridge',
    'ferry_terminal': 'Ferry Terminal',
    'subway_station': 'Subway Station',
    'train_station': 'Train Station',
    'bus_station': 'Bus Station',
    'airport': 'Airport',
    'parking': 'Parking',
    'gas_station': 'Gas Station',
    'electric_vehicle_charging_station': 'EV Charging Station',
  };

  static mapType(type: string): string {
    if (!type) return 'Unknown';

    const normalizedType = type.toLowerCase().trim();
    return this.TYPE_MAP[normalizedType] || this.formatFallback(normalizedType);
  }

  private static formatFallback(type: string): string {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Получить все доступные типы
  static getAllTypes(): Record<string, string> {
    return { ...this.TYPE_MAP };
  }
}
