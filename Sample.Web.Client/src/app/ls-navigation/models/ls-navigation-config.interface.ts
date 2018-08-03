
export interface LsNavigationConfigInterface {
  /** 
   * offset to take in account when scrolling to a section in a page
   * i.e. navbarheight in the header 
   */
  headerOffset: number;

  /** 
   * meaning of the id on the html-tags marked with the ls-navigation-section directive
   *  true  = id is a fragment i.e. id="section" -> /path#section
   *  false = id is a url-path i.e. id="section" -> /path/section
  */
  useFragments: boolean;

  /**
   * how the Url is kept actual when scrolling manually
   * false = use of location.go           ( updates the url in the browsers only )
   * true  = use of router.navigatebyUrl  ( updates the url in router and in the browsers )
   */
  updateRouterOnManualScroll: boolean;


  /**
   * null = exact match ( default )
   * 
   */
  activeLinkDisplayPartialMatch: boolean;

}