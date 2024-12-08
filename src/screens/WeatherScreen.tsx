import React, { useState, useEffect } from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { fetchWeather, fetchHourlyWeather } from '../services/WeatherService';

const WeatherScreen: React.FC = () => {
    const [weather, setWeather] = useState<any>(null);
    const [hourlyWeather, setHourlyWeather] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [city, setCity] = useState<string>('Istanbul');
    const [input, setInput] = useState<string>('');
    const [currentDate, setCurrentDate] = useState<string>('');
    const [isNightMode, setIsNightMode] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    // Fetches current and hourly weather data for a given city.
    const getWeather = async (cityName: string) => {
        try {
            const data = await fetchWeather(cityName);
            setWeather(data);
            const hourlyData = await fetchHourlyWeather(cityName);
            setHourlyWeather(hourlyData);
            setCity(cityName);
            setError(null);
        } catch (err) {
            console.error('Error fetching weather data:', err);
            setError('Geçersiz şehir adı girdiniz.');
            setShowModal(true);
        }
    };

    // Fetches weather data on component mount and sets the current date
    useEffect(() => {
        const date = new Date();
        const formattedDate = `${date.toLocaleDateString('tr-TR', {
            weekday: 'long',
        })}, ${date.toLocaleDateString()}`;
        setCurrentDate(formattedDate);
        const currentHour = date.getHours();
        setIsNightMode(currentHour >= 18);
        getWeather(city);
    }, []);

    // Handles user search
    const handleSearch = () => {
        if (input.trim()) {
            try {
                getWeather(input);
                setInput('');
            } catch (err) {
                console.error('Error in handleSearch:', err);
            }
        }
    };

    // Toggles between day and night mode
    const toggleTheme = () => {
        setIsNightMode(!isNightMode);
    };

    return (
        <LinearGradient
            colors={isNightMode ? ['rgba(26, 35, 126, 1)', 'rgba(38, 50, 98, 0.8)', 'rgba(44, 62, 80, 1)'] : ['rgba(79, 172, 254, 1)', 'rgba(161, 196, 253, 0.9)']}
            style={styles.gradientContainer}>
            <View style={styles.topBar}>
                {/* Date */}
                <Text style={[styles.date, { color: isNightMode ? '#fff' : '#000' }]}>
                    {currentDate}
                </Text>

                {/* Theme Buttons */}
                <TouchableOpacity onPress={toggleTheme}>
                    <Image
                        source={{
                            uri: isNightMode
                                ? 'https://img.icons8.com/ios-filled/50/ffffff/sun--v1.png'
                                : 'https://img.icons8.com/ios-filled/50/ffffff/crescent-moon.png',
                        }}
                        style={styles.nightModeIcon}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={[
                            styles.searchInput,
                            {
                                backgroundColor: isNightMode ? '#444' : '#fff',
                                color: isNightMode ? '#fff' : '#000',
                            },
                        ]}
                        placeholder="Şehir Giriniz..."
                        placeholderTextColor={isNightMode ? '#aaa' : '#000'}
                        value={input}
                        onChangeText={setInput}
                    />
                    <TouchableOpacity
                        style={[
                            styles.searchButton,
                            { backgroundColor: isNightMode ? '#666' : '#3881c2' },
                        ]}
                        onPress={handleSearch}>
                        <Text
                            style={[
                                styles.searchButtonText,
                                { color: isNightMode ? '#fff' : '#fff' },
                            ]}>
                            Ara
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Weather Header */}
                <View style={styles.header}>
                    <Text style={[styles.city, { color: '#fff' }]}>{city}</Text>
                    <Text style={[styles.temp, { color: '#fff' }]}>
                        {weather?.main.temp || '--'}°
                    </Text>
                    <Text style={[styles.description, { color: isNightMode ? '#ddd' : '#666' }]}>
                        {weather?.weather[0].description.toUpperCase() || 'HAVA DURUMU'}
                    </Text>
                </View>

                {/* Weather Icon */}
                <View style={styles.iconContainer}>
                    <Image
                        style={styles.icon}
                        source={{
                            uri: `https://openweathermap.org/img/wn/${weather?.weather[0].icon || '01d'
                                }@4x.png`,
                        }}
                    />
                </View>

                {/* Hourly Weather */}
                <View style={styles.hourlyContainer}>
                    <Text style={[styles.sectionTitle, { color: '#fff' }]}>
                        Saatlik Hava Durumu
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {hourlyWeather.map((item, index) => (
                            <View
                                style={[
                                    styles.hourlyCard,
                                    { backgroundColor: isNightMode ? '#555' : '#fff' },
                                ]}
                                key={index}>
                                <Text style={{ color: isNightMode ? '#fff' : '#000' }}>{item.hour}</Text>
                                <Image style={styles.hourlyIcon} source={{ uri: item.icon }} />
                                <Text style={{ color: isNightMode ? '#fff' : '#000' }}>{item.temp}°</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Weather Details */}
                <View style={styles.detailsContainer}>
                    <Text style={[styles.sectionTitle, { color: '#fff' }]}>
                        Detaylar
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.detailCard}>
                            <Text style={styles.detail}>Rüzgar: {weather?.wind.speed} m/s</Text>
                        </View>
                        <View style={styles.detailCard}>
                            <Text style={styles.detail}>Nem: {weather?.main.humidity}%</Text>
                        </View>
                        <View style={styles.detailCard}>
                            <Text style={styles.detail}>
                                Hissedilen Sıcaklık: {weather?.main.feels_like}°
                            </Text>
                        </View>
                        <View style={styles.detailCard}>
                            <Text style={styles.detail}>
                                Basınç: {weather?.main.pressure} hPa
                            </Text>
                        </View>
                    </ScrollView>
                </View>


                {/* Error Message */}
                <Modal
                    visible={showModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowModal(false)}>
                    <View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: isNightMode ? '#333' : '#fff',
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.modalText,
                                {
                                    color: isNightMode ? '#fff' : '#000',
                                },
                            ]}
                        >
                            {error}
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.modalButton,
                                {
                                    backgroundColor: isNightMode ? '#555' : '#4facfe',
                                },
                            ]}
                            onPress={() => setShowModal(false)}
                        >
                            <Text
                                style={[
                                    styles.modalButtonText,
                                    {
                                        color: isNightMode ? '#fff' : '#fff',
                                    },
                                ]}
                            >
                                Kapat
                            </Text>
                        </TouchableOpacity>
                    </View>

                </Modal>



            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 10,
    },
    date: {
        fontSize: 16,
    },
    nightModeIcon: {
        width: 30,
        height: 30,
    },
    container: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        width: '90%',
    },
    searchInput: {
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        fontSize: 16,
    },
    searchButton: {
        backgroundColor: '#4facfe',
        borderRadius: 5,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    city: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    temp: {
        fontSize: 64,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 18,
        fontStyle: 'italic',
    },
    iconContainer: {
        marginVertical: 20,
    },
    icon: {
        width: 150,
        height: 150,
    },
    hourlyContainer: {
        marginTop: 20,
        width: '90%',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    hourlyCard: {
        alignItems: 'center',
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 5,
    },
    hourlyIcon: {
        width: 40,
        height: 40,
        marginVertical: 5,
    },
    detailsContainer: {
        marginTop: 20,
        width: '90%',
    },
    detailCard: {
        backgroundColor: '#ffffffaa',
        borderRadius: 10,
        padding: 16,
        marginHorizontal: 10,
        alignItems: 'center',
    },
    detail: {
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -150 }, { translateY: -75 }],
        width: 300,
        height: 150,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#4facfe',
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default WeatherScreen;
