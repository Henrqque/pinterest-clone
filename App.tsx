import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Text,
  ScrollView,
} from 'react-native';

import FastImage from 'react-native-fast-image';

interface Filme {
  id: string;
  download_url: string;
  author: string;
}

const {width} = Dimensions.get('window');
export default function App() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<Filme[]>([]);

  useEffect(() => {
    async function getImage() {
      const response = await axios.get('https://picsum.photos/v2/list');
      setImages(response.data);
    }

    getImage();
    setLoading(false);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <FlatList
      data={[0]}
      renderItem={({item}) => {
        return (
          <View style={styles.container}>
            <View style={styles.pin}>
              {images
                .filter((item, index) => index % 2 === 0)
                .map(item => (
                  <ImageResizer key={item.id} data={item} index={0} />
                ))}
            </View>
            <View style={styles.pin}>
              {images
                .filter((item, index) => index % 2 === 1)
                .map(item => (
                  <ImageResizer key={item.id} data={item} index={0} />
                ))}
            </View>
          </View>
        );
      }}
    />
  );
}

interface Props {
  data: Filme;
  index: number;
}
function ImageResizer({data, index}: Props) {
  const [ratio, setRatio] = useState(1);

  useEffect(() => {
    if (data.download_url) {
      Image.getSize(data.download_url, (width, heigth) =>
        setRatio(width / heigth),
      );
    }
  }, [data.download_url]);

  return (
    <View style={styles.viewImage}>
      <FastImage
        style={[styles.image, {aspectRatio: ratio}]}
        source={{
          uri: data.download_url,
          priority: FastImage.priority.high,
        }}
      />
      <Text style={styles.description}>{data.author}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  pin: {
    width: width / 2 - 20,
    flex: 1,
  },
  viewImage: {
    marginHorizontal: 5,
    marginBottom: 10,
  },
  image: {
    width: width / 2 - 20,
    borderRadius: 10,
  },
  description: {
    fontSize: 17,
    color: '#333',
    marginTop: 5,
  },
});
