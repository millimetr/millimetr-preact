const STARTERS_ARRAY = require('./src/data/starters.json');

const createConfig = async () => ({
    /**
     * Files that should be copied directly to build.
     *
     * This is usually where you place all non-ejs files that you want in the
     * build. If you are compiling your assets through
     * [Parcel](https://parceljs.org/), [Webpack](https://webpack.js.org/),
     * [Gulp](https://gulpjs.com/) or another asset pipeline then you should
     * also compile the results/bundles here.
     *
     * For example `./src/static/favicon.ico` will be copied as is to
     * `build/favicon.icon` and `./src/static/css/styles.css` will be copied to
     * `build/css/styles.css`
     */
    static: './src/static',

    /**
     * This is the folder where the user-facing code will be compiled to. 
     *
     * If you are using a service like [Netlify](https://www.netlify.com/) or
     * [Vercel](https://vercel.com/) then you should configure your
     * build/deployment to publish this folder. Alternatively if you are
     * manually uploading your site via [Netlify
     * Drop](https://app.netlify.com/drop), [Github
     * pages](https://pages.github.com/), [Amazon
     * S3](https://aws.amazon.com/s3/) or FTP then you should use the contents
     * of this folder.
     */
    output: './build',

    /**
     * Specify a folder that will trigger a rebuild if any files in it is
     * changed while running `millimetr develop` or  `npm run start`. 
     *
     * If you want to ignore any files/folders from trigger a rebuild then
     * specify them via the `exclude` option below.
     */
    input: './src',

    /**
     * Accepts an array of strings, globs or regular expressions (via
     * [anymatch](https://github.com/micromatch/anymatch)) that should be
     * ignored completely by millimetr when running `build` or `develop`.
     *
     * Note that this will also be applied to the contents of the `static`
     * folder.
     */
    exclude: [],

    /**
     * A global object that should automatically be exposed in all routes under
     * `millimetr.globals`.
     *
     * This is useful for any data that you want to make sure if always
     * available everywhere in your site, or fallback information if a specific
     * value is not supplied to a route.
     */
    globals: {
        language: 'en',
        title: 'Millimeter Default Starter',
        description: 'A base starting template for millimetr projects.'
    },


    /**
     * In additional to the above millimetr also passes an `internals` object to
     * all templates automatically. 
     *
     * These values can be accessed via `millimetr.internals` and are as
     * follows:
     *
     * - `millimetr.internal.routes.all`: A list of all routes created by
     *   millimeter. Is an array of objects that contain `url` and `title`
     *   values. Useful for creating site navigation.
     *
     * - `millimetr.internal.routes.active`: The current route millimetr is
     *   building. Is an object that contain an `url` and `title` value. This is
     *   useful if you want to highlight the current active route via CSS.
     *
     * However, there are instances where you would want to modify these values
     * before exposing them via the above. The following (optional) callback
     * allows you to do this.
     *
     * The callback automatically passes the default `internals` object above to
     * templates as it's first argument. The callback should consume these
     * values, modify them as needed and then return the modified values.
     *
     * Note that if you want to prevent any internal values from being passed to
     * the templates then simply have the callback return `null`. 
     *
     */
    transformInternals: (internals) => ({
        ...internals,
        routes: {
            ...internals.routes,
            all: internals.routes.all.map(singleRoute => {
                if (singleRoute.url === '/') {
                    return {
                        title: 'Homepage',
                        url: '/',
                    }
                }
    
                return singleRoute;
            }),
        }
    }),

    /**
     * This is where the majority of all millimetr logic sits.
     *
     * This value is array of objects used to created all routes for your site.
     * Note that each route requires both an [relative
     * URL](https://www.seoclarity.net/resources/knowledgebase/difference-relative-absolute-url-15325
     * value and a title value (used in debugging, but can also be consumed in
     * the template).
     *
     * Any additional values are passed as-is to the templates. These values can
     * be hardcoded, generated dynamically ot retrieved remotely via [await
     * JavaScript
     * operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await).
     */
    routes: [
        {
            url: '/',
            title: 'Millimeter Preact Starter',
            template: './src/views/homepage.ejs',
        },
        {
            url: '/hardcoded',
            title: 'Hardcoded Data',
            starters: STARTERS_ARRAY.filter(({ name }) => name !== 'millimetr-preact'),
            template: './src/views/starters.ejs',
        },
        {
            url: '/dynamic',
            title: 'Dynamic Data',
            template: './src/views/dynamic.ejs',
            date: new Date(),
        },
        {
            url: '/remote',
            title: 'Remote Data',
            template: './src/views/remote.ejs',
        },

    ],
})

module.exports = createConfig;
