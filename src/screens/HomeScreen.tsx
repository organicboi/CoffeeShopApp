import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import CoffeeCard from '../components/CoffeeCard';

const getCategoriesFromData = (data: any) => {
  let temp: any = {};
  for (let i = 0; i < data.length; i++) {
    if (temp[data[i].name] == undefined) {
      temp[data[i].name] = 1;
    } else {
      temp[data[i].name]++;
    }
  }
  let categories = Object.keys(temp);
  categories.unshift('All');
  return categories;
};

const getCoffeeList = (category: string, data: any) => {
  if (category == 'All') {
    return data;
  } else {
    let coffelist = data.filter((item: any) => item.name === category);
    return coffelist;
  }
};

const HomeScreen = () => {
  const CoffeeList = useStore((state: any) => state.CoffeeList);
  const BeansData = useStore((state: any) => state.BeanList);
  const [categories, setCategories] = useState(
    getCategoriesFromData(CoffeeList),
  );
  const [searchText, setSearchText] = useState('');
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  });
  const [sortedCoffee, setSortedCoffee] = useState(
    getCoffeeList(categoryIndex.category, CoffeeList),
  );
  console.log('sorted Coffee:---->', sortedCoffee.length);

  const ListRef: any = useRef<FlatList>();

  const tabBarHeight = useBottomTabBarHeight();

  const searchCoffee = (search: string) => {
    if (search != '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({index: 0, category: categories[0]});
      setSortedCoffee([
        ...CoffeeList.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      ]);
    }
  };

  const resetSearchCoffee = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setCategoryIndex({index: 0, category: categories[0]});
    setSortedCoffee([...CoffeeList]);
    setSearchText('');
  };

  return (
    <>
      <View style={styles.ScreenContainer}>
        <StatusBar backgroundColor={COLORS.primaryBlackHex} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ScrollViewFlex}>
          {/* app Header */}
          <HeaderBar title="Coffee Shop" />
          <Text style={styles.ScreenTitle}>
            Find The Best{'\n'}Coffee For You
          </Text>
          {/* Search Input */}
          <View style={styles.InputContainerComponent}>
            <TouchableOpacity
              onPress={() => {
                searchCoffee(searchText);
              }}>
              <CustomIcon
                style={styles.InputIcon}
                name="search"
                size={FONTSIZE.size_18}
                color={
                  searchText.length > 0
                    ? COLORS.primaryOrangeHex
                    : COLORS.primaryGreyHex
                }
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Find your Coffee..."
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                searchCoffee(text);
              }}
              placeholderTextColor={COLORS.primaryLightGreyHex}
              style={styles.TextInputContainer}
            />
            {searchText.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  resetSearchCoffee();
                }}>
                <CustomIcon
                  style={styles.InputIcon}
                  name="close"
                  size={FONTSIZE.size_16}
                  color={COLORS.primaryLightGreyHex}
                />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>

          {/* Category Scroller  */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.CategoryScrollViewStyle}>
            {categories.map((data, index) => (
              <View
                key={index.toString()}
                style={styles.CategoryScrollViewContainer}>
                <TouchableOpacity
                  style={styles.CategoryScrollViewItem}
                  onPress={() => {
                    ListRef?.current?.scrollToOffset({
                      animated: true,
                      offset: 0,
                    });
                    setCategoryIndex({
                      index: index,
                      category: categories[index],
                    });
                    setSortedCoffee([
                      ...getCoffeeList(categories[index], CoffeeList),
                    ]);
                  }}>
                  <Text
                    style={[
                      styles.categoryText,
                      categoryIndex.index == index
                        ? {color: COLORS.primaryOrangeHex}
                        : {},
                    ]}>
                    {data}
                  </Text>
                  {categoryIndex.index == index ? (
                    <View style={styles.AcitveCategory} />
                  ) : (
                    <></>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          {/* Coffee Flat list */}
          <FlatList
            ref={ListRef}
            horizontal
            ListEmptyComponent={
              <View style={styles.EmptyListContainer}>
                <Text style={styles.categoryText}>No Coffee To Buzz! </Text>
              </View>
            }
            showsHorizontalScrollIndicator={false}
            data={sortedCoffee}
            contentContainerStyle={styles.FlatListContainer}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <TouchableOpacity onPress={() => {}}>
                  <CoffeeCard
                    id={item.id}
                    index={item.index}
                    type={item.type}
                    rosted={item.rosted}
                    imagelink_square={item.imagelink_square}
                    name={item.name}
                    special_ingredient={item.special_ingredient}
                    average_rating={item.average_rating}
                    price={item.prices[2]}
                    buttonPRessHandler={() => {}}
                  />
                </TouchableOpacity>
              );
            }}
          />

          <Text style={styles.CoffeeBeansTitle}>Coffee Beans</Text>
          {/* Beans flat list */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={BeansData}
            contentContainerStyle={[
              styles.FlatListContainer,
              {marginBottom: tabBarHeight},
            ]}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <TouchableOpacity onPress={() => {}}>
                  <CoffeeCard
                    id={item.id}
                    index={item.index}
                    type={item.type}
                    rosted={item.rosted}
                    imagelink_square={item.imagelink_square}
                    name={item.name}
                    special_ingredient={item.special_ingredient}
                    average_rating={item.average_rating}
                    price={item.prices[2]}
                    buttonPRessHandler={() => {}}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </ScrollView>
      </View>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    margin: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  CategoryScrollViewStyle: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  CategoryScrollViewContainer: {
    paddingHorizontal: SPACING.space_15,
  },
  CategoryScrollViewItem: {
    alignItems: 'center',
  },

  categoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },

  AcitveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,

    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.3,
  },
  CoffeeBeansTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
});
