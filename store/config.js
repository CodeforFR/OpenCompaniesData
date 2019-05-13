import axios from 'axios'

export const state = () => ({

  // APIVIZ CONFIG
  config : {
    'global' : undefined,
    'styles' : undefined,
    'socials' : undefined,
    'footer' : undefined,
    'navbar' : undefined,
    'routes' : undefined,
    'tabs' : undefined,
    'endpoints' : undefined,
  },

  localRouteConfig : undefined,

  localEndpointConfig : undefined,
  localFiltersConfig : undefined,
  currentDatasetURI : undefined,

})

export const getters = {

  // APP CONFIG GETTERS
  // - - - - - - - - - - - - - - - //
    getConfig : state => {
      console.log( "... here comes the app config : \n", state.config )
      return state.config
    },
    getEndpointConfigAuthUsers : state => {
      // console.log("getEndpointConfigAuthUsers...")
      return state.config.endpoints.filter(function(r) {
        return r.data_type === "user"
      });
    },
    getEndpointConfigAuthSpecific : (state, getters) => (endpointType) => {
      console.log("getEndpointConfigAuthSpecific / endpointType : ", endpointType)
      let allAuthEndpoints =  getters.getEndpointConfigAuthUsers
      // console.log("getEndpointConfigAuthSpecific / allAuthEndpoints", allAuthEndpoints)
      return allAuthEndpoints.find(function(r) {
        return r.endpoint_type === endpointType
      });
    },

  // ROUTE CONFIG GETTERS
  // - - - - - - - - - - - - - - - //
    getCurrentRouteConfig : (state, dispatch) => (currentRoute) => {
      // console.log('\n ++ getCurrentRouteConfig / currentRoute : ', currentRoute)
      // console.log(' ++ getCurrentRouteConfig / state.config.routes : \n', state.config.routes)
      try {
        return state.config.routes.find(function(r) {
          return r.urls.indexOf(currentRoute) !== -1;
        });
      } catch (e) {
        console.log('err',e);
        return undefined
      }
    },
    getLocalRouteConfig : state => {
      return state.localRouteConfig
    },

  // global-related
    getGlobalConfig : state => {
      return state.config.global
    },
    getAppLocales : state => {
      return (state.config.global) ? state.config.global.app_languages : 'fr' 
    },

  // styles-related 
    getStylesConfig : state => {
      return state.config.styles
    },

  // navbar-related 
    hasNavbar : (state) => {      
      // console.log('S-config-hasNavbar ... state.localRouteConfig : \n', state.localRouteConfig)
      return (state.localRouteConfig) ? state.localRouteConfig.has_navbar : false 
    },
    getNavbarConfig : state => {
      return (state.config.navbar) ? state.config.navbar.app_navbar : undefined 
    },
    getNavbarLogo : state => {
      return (state.config.global) ? state.config.global.app_logo : undefined 
    },
    getNavbarBrand : state => {
      return (state.config.global) ? state.config.global.app_title.content : undefined 
    },

  // footer-related
    hasFooter : (state) => {
      return (state.localRouteConfig) ? state.localRouteConfig.has_footer : false 
    },
    hasCreditsFooter : (state) => {
      // console.log('S-config-hasCreditsFooter ... state.localRouteConfig : \n', state.localRouteConfig)
      return (state.localRouteConfig.has_credits_footer) ? state.localRouteConfig.has_credits_footer : false 
    },
    getFooterConfig : state => {
      return (state.config.footer) ? state.config.footer.app_footer : undefined 
    },
    getSocialsConfig : state => {
      return state.config.socials
    },

  // banner-related
    hasBanner : state => {      
      // console.log('S-config-hasBanner ... state.localRouteConfig : \n', state.localRouteConfig)
      return (state.localRouteConfig) ? state.localRouteConfig.banner.activated : false 
    },
    getCurrentBanner : (state, getters) => {
      // console.log('S-config-getCurrentBanner ...')
      let bannersSet = getters.getStylesConfig.app_banners.banners_set
      const routeBannerUri = state.localRouteConfig.banner.banner_uri
      let resultSet = bannersSet.find(function(b) {
        return b.banner_uri == routeBannerUri
      })
      // console.log('S-config-getCurrentBanner ... resultSet : \n', resultSet)
      return resultSet
    },

  // ENDPOINTS CONFIG GETTERS
  // - - - - - - - - - - - - - - - //``



  

}

export const mutations = {

  setConfig(state, {type,result}) {
    // console.log("S-setConfig ... result : ", result)
    // console.log("result : ", result)
    state.config[type] = result
  },

  setLocalRouteConfig(state, routeConfig) {
    console.log("S-config-setConfig...")
    state.localRouteConfig = routeConfig
    console.log("S-config-setConfig / state.localRouteConfig : ", state.localRouteConfig)
  },

}

export const actions = {

  getConfigType({commit, rootGetters},{type, configTypeEndpoint, args}) {
    console.log("getConfigType / type : ", type)
    const rootURLbackend = rootGetters['getRootUrlBackend']
    const apivizFrontUUID = rootGetters['getApivizFrontUUID']
    // return this.$axios.get(rootURLbackend+'/config/'+configTypeEndpoint+"?uuid="+apivizFrontUUID+args)
    return axios.get(rootURLbackend+'/config/'+configTypeEndpoint+"?uuid="+apivizFrontUUID+args)
    .then(response => {
      // console.log("\ngetConfigType / type : ", type)
      // console.log("getConfigType / response : ", response)
      let app_config = (response && response.data && response.data.app_config) ? response.data.app_config : undefined
      commit('setConfig', {type:type,result:app_config}); 
      return app_config
    })
    .catch( err => 
      console.log('there was an error trying to fetch some configuration file', err) 
    )
  },

  getConfigAll({dispatch}) {
    let arr = []
    arr.push(dispatch('getConfigType',{type:'global',    configTypeEndpoint:'global', args:''}) )
    arr.push(dispatch('getConfigType',{type:'styles',    configTypeEndpoint:'styles', args:''}) )
    arr.push(dispatch('getConfigType',{type:'socials',   configTypeEndpoint:'socials', args:''}) )
    arr.push(dispatch('getConfigType',{type:'footer',    configTypeEndpoint:'footer', args:''}) )
    arr.push(dispatch('getConfigType',{type:'navbar',    configTypeEndpoint:'navbar', args:''}) )
    arr.push(dispatch('getConfigType',{type:'routes',    configTypeEndpoint:'routes', args:'&as_list=true'}) )
    arr.push(dispatch('getConfigType',{type:'tabs',      configTypeEndpoint:'tabs', args:'&as_list=true'}) )
    arr.push(dispatch('getConfigType',{type:'endpoints', configTypeEndpoint:'endpoints', args:'&as_list=true'}) )
    return Promise.all(arr)
  },



}