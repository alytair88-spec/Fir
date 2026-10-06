import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';

import { getCategory } from '@/constants/categories';
import type { Business } from '@/lib/types';

interface Props {
  business: Business;
  onPress: (business: Business) => void;
}

export function BusinessMarker({ business, onPress }: Props) {
  const category = getCategory(business.category);
  return (
    <Marker
      coordinate={{ latitude: business.latitude, longitude: business.longitude }}
      title={business.name}
      description={business.address}
      onCalloutPress={() => onPress(business)}
      // Static custom view: no need to re-render the bitmap on every map update.
      tracksViewChanges={false}
    >
      <View style={[styles.pin, { backgroundColor: category.color }]}>
        <Text style={styles.emoji}>{category.emoji}</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  emoji: { fontSize: 16 },
});
