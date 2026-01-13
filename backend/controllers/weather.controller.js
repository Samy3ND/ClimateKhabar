export const getCurrentWeather = async (req, res, next) => {
  try {
    const { lat, lon, city } = req.query;

    let query = "Kathmandu";
    if (lat && lon) query = `${lat},${lon}`;
    else if (city) query = city;

    if (!process.env.WEATHER_API_KEY) {
      throw { statusCode: 500, message: "WEATHER_API_KEY missing in environment variables" };
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${query}&days=1&aqi=yes&alerts=yes`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw { statusCode: response.status, message: data.error?.message || "Weather API error" };
    }

    const { location, current, alerts } = data;

    res.status(200).json({
      location: {
        name: location.name,
        country: location.country
      },
      current: {
        temp_c: current.temp_c,
        feelslike_c: current.feelslike_c,
        humidity: current.humidity,
        wind_kph: current.wind_kph,
        uv: current.uv,
        condition: {
          text: current.condition.text,
          icon: current.condition.icon
        },
        last_updated: current.last_updated,
        aqi: current.air_quality?.["us-epa-index"] || null
      },
      alerts: alerts?.alert || []
    });

  } catch (error) {
    next(error);
  }
};
