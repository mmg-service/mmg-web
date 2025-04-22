export default {
    namespaced: true,
    
    state: {
      currentLocation: null,
      mapCenter: { lat: 37.5665, lng: 126.9780 }, // 서울 기본 좌표
      mapZoom: 15,
      markers: []
    },
    
    mutations: {
      setCurrentLocation(state, location) {
        state.currentLocation = location
      },
      setMapCenter(state, center) {
        state.mapCenter = center
      },
      setMapZoom(state, zoom) {
        state.mapZoom = zoom
      },
      setMarkers(state, markers) {
        state.markers = markers
      },
      addMarker(state, marker) {
        state.markers.push(marker)
      },
      clearMarkers(state) {
        state.markers = []
      }
    },
    
    actions: {
      getUserLocation({ commit }) {
        return new Promise((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              position => {
                const location = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }
                commit('setCurrentLocation', location)
                commit('setMapCenter', location)
                resolve(location)
              },
              error => {
                console.error('Geolocation error:', error)
                reject(error)
              }
            )
          } else {
            const error = new Error('Geolocation is not supported by this browser.')
            console.error(error)
            reject(error)
          }
        })
      },
      updateMapMarkers({ commit }, restaurants) {
        const markers = restaurants.map(restaurant => ({
          id: restaurant.id,
          position: {
            lat: restaurant.latitude,
            lng: restaurant.longitude
          },
          title: restaurant.name,
          rating: restaurant.rating
        }))
        commit('setMarkers', markers)
      }
    },
    
    getters: {
      userLocation: state => state.currentLocation,
      mapCenterPosition: state => state.mapCenter,
      allMarkers: state => state.markers
    }
  }