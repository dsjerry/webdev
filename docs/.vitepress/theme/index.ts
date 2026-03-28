import "./styles/custom.css"
import DefaultTheme from "vitepress/theme"
import { h } from "vue"

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {})
    },
    enhanceApp({ app, router, siteData }) {},
}
