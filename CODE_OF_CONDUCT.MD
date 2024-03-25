# Coding Guidelines

## Next.js

1. Code should be functional in style rather than Object Orientated or Imperative unless there are no clean alternatives.

- Avoid mutating variables and the let keyword.
- Prefer functional & immutable array methods .ie map/filter/reduce/some/every over any types of mutable for loop.
- Prefer "return early" coding style, more about it [here](https://medium.com/@matryer/line-of-sight-in-code-186dd7cdea88).
- Don't Repeat Yourself. Make extensive use of the constants and utils files for re-usable strings and methods.
- Don't obsess over performance of code, obsess over making it clear.

2. Components should be simple and composable and cater to real life UI design problems:

- **Simplicity**: Strive to keep the component API fairly simple and show real-world scenarios of using the component.
- **Representational**: React components should be templates, free of logic, and purely presentational. It aims to make our components shareable and easy to test.
- **Composition**: Break down components into smaller parts with minimal props to keep complexity low, and compose them together. This will ensure that the styles and functionality are flexible and extensible.
- **Accessibility**: When creating a component, keep accessibility top of mind. This includes keyboard navigation, focus management, color contrast, voice over, and the correct aria-\* attributes.
- **Naming Props**: We all know naming is the hardest thing in this industry. Generally, ensure a prop name is indicative of what it does. Boolean props should be named using auxiliary verbs such as does, has, is and should. For example, Button uses `isDisabled`, `isLoading`, etc.

3. Maintain the separation of concerns in the folder structure laid out in the initial scaffold:

- `constants/` contains shared variables used across the app. [Learn more](https://dev.to/amirfakour/tips-to-use-constants-file-in-typescript-27je).
- `components/` contains shared ui components used across the app. [Learn more](https://javascript.plainenglish.io/working-with-components-and-layouts-in-next-js-3a13ce51d03b).
- `utils/` contains a variety of things, such as reusable library instances, some dummy data, or shared functions used across the app.
- `hooks/` contains shared hooks used across the app.
- `providers/` contains providers that encapsulate logic related to state management, configuration retrieval, or any other cross-cutting concerns.

**Whenever logic is being used in more than one component, it’s recommended to extract the logic into a custom hook. This custom hook encapsulates the logic and returns the desired value on passing different inputs. This makes a developer follow DRY(don’t repeat yourself) and removes the code redundancy in the application.**

4. State Management with Context

Context in React provides a way to share state and functions across components without the need for prop drilling. This is especially useful for scenarios where multiple components need access to the same data or functions.

1.  Create the Context. Create a new context using the createContext function from React.
2.  Create a Provider Component. Build a provider component that wraps its children, providing access to the context. Define state or any logic related to the context within this component.
3.  Wrap Your App with the Provider. Wrap your entire application or the relevant part of it with the provider component.
4.  Consume the Context in Components. Use the useContext hook to consume the context in your components. Import the context and use it within your components as needed.

5.  Naming Convention

**Always use meaningful names**

- Under the app directory, `Kebab` case. We use `Kebab` in this scenario for Routing purposes. Eg, `app.jsx`, `not-found.jsx`.
- Under the components directory, `pascal` case. We use `Pascal` for components file names and components names itself. Eg for files, `Button.jsx`, `MyContainer.jsx`. Eg for components, `Button`, `MyContainer`.
- Component style use `Pascal` with `dot notation`. Eg, `Button.modules.css`. Every css file for component should include `.module.css`.
- Hooks must use `camel` case and have the prefix `use`. Eg, `useSearch.jsx`.
- Providers must use `camel` case and have the suffix `Provider`. Eg, `searchProvider.jsx`.
- [Resource One](https://medium.com/@mirazhs/naming-conventions-in-next-js-boosting-seo-and-code-maintainability-d4150fe7e6e#:~:text=In%20NextJS%2C%20it%20is%20recommended,js%20%2C%20use%20about%2Dus.). [Resource Two](https://medium.com/@hiro08gh/next-js-naming-conventions-are-checked-with-eslint-rules-946371d67882).

6. Exports from files can be either as variable or default exports, but please stick to naming the object before using `export default` to avoid anonymous module names in stack traces and React dev tools.

7. Code Formatting

- Trailing Comma to es5 standard.
- Tab Width has to be 2 spaces.
- A semicolon is **REQUIRED** at the end of each statement.
- String literals must use Single Quotes.

**Prettier is pre-installed with the project and contains the default Code Formatting rules. Make use of it by running `yarn prettier`**

8. Proper Commenting

- Incorporate meaningful comments within your code to explain complex logic or why certain decisions were made. However, don't overdo it; code should be self-explanatory whenever possible.

## GitHub

1. Perform work in a feature branch.

_Why:_

> Because this way all work is done in isolation on a dedicated branch rather than the main branch. It allows you to submit multiple pull requests without confusion. You can iterate without polluting the master branch with potentially unstable, unfinished code.

2. Branch out from dev

_Why:_

> This way, you can make sure that code in master will almost always build without problems, and can be mostly used directly for releases.

3. Never push into `dev` or `main` branch. Make a Pull Request.

_Why:_

> It notifies team members that they have completed a feature. It also enables easy peer-review of the code and dedicates forum for discussing the proposed feature.

4. Update your local `dev` branch and do an interactive rebase before pushing your feature and making a Pull Request.

_Why:_

> Rebasing will merge in the requested branch (`main` or `dev`) and apply the commits that you have made locally to the top of the history without creating a merge commit (assuming there were no conflicts). Resulting in a nice and clean history. [read more ...](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)

5. Resolve potential conflicts while rebasing and before making a Pull Request.

6. Before making a Pull Request, make sure your feature branch builds successfully and passes all tests (including code style checks).

_Why:_

> You are about to add your code to a stable branch. If your feature-branch tests fail, there is a high chance that your destination branch build will fail too. Additionally, you need to apply code style check before making a Pull Request. It aids readability and reduces the chance of formatting fixes being mingled in with actual changes.

## Design - CSS

1. Avoid hard coding colors. All colors from the design guideline should be pre-defined in the `root`. Please use them with respect.

2. Try to avoid injecting styles via `style` attribute because it's impossible to build responsiveness with inline styles. Strive to only use Tailwind classes for sizing, spacing, and building grid layouts.

```jsx
   // Don't
   <div style={{marginLeft: '8px'}}></div

   // Do
   <div className="container"></div

   // Grid layout
   <div className={style.grig}>
     <div className={style.col-2}></div>
     <div className={style.col-1}></div>
   </div>
```

3. Formatting

All CSS documents must use two spaces for indentation and files should have no trailing whitespace. Other formatting rules:

- Use soft-tabs with a two space indent.
- Use double quotes.
- Use shorthand notation where possible.
- Put spaces after `:` in property declarations.
- Put spaces before `{` in rule declarations.
- Use hex color codes `#000` unless using `rgba()`.
- Always provide fallback properties for older browsers.
- Use one line per property declaration.
- Always follow a rule with one line of whitespace.
- Always quote `url()` and `@import()` contents.
- Do not indent blocks.
- Use `rem` units for font-sizes and media query break points.
- Use `ch` units for line lengths in paragraphs or form labels.
- When creating mastheads and banners that need a height, use `vh` values.
- The Viewpoint units `vw`, `vh`, `vmin`, and `vmax` are good for layout min and max sizes.
- CSS classnames should be descriptive and indicate the part of the interface they style. Avoid things like `p1`.

eg:

```css
.media {
  overflow: hidden;
  color: #fff;
  background-color: #000; /* Fallback value */
  background-image: linear-gradient(black, grey);
}

.media .img {
  float: left;
  border: 0.075rem solid #ccc;
}

.media .img img {
  display: block;
}

.media .content {
  background: #fff url('../images/media-background.png') no-repeat;
}
```

4. Naming

All ids, classes and attributes must be lowercase with hyphens used for separation.

```css
/* GOOD */
.dataset-list {
}

/* BAD */
.datasetlist {
}
.datasetList {
}
.dataset_list {
}
```

5. Modularity and specificity

Try keep all selectors loosely grouped into modules where possible and avoid having too many selectors in one declaration to make them easy to override.

```css
/* Avoid */
ul#dataset-list {
}
ul#dataset-list li {
}
ul#dataset-list li p a.download {
}
```

Instead here we would create a dataset “module” and styling the item outside of the container allows you to use it on it’s own e.g. on a dataset page:

```css
.dataset-list {
}
.dataset-list-item {
}
.dataset-list-item .download {
}
```

Avoid using tag names in selectors as this prevents re-use in other contexts.

```css
/* Cannot use this class on an <ol> or <div> element */
ul.dataset-item {
}
```

Also ids should not be used in selectors as it makes it far too difficult to override later in the cascade.

```css
/* Cannot override this button style without including an id */
.btn#download {
}
```

- Use [Storybook](https://storybook.js.org/) to Visualize UI Components

**To use run: `yarn storybook`**

## Resources

[NEXT.js](https://nextjs.org/)

[ESLint](https://eslint.org/)

[Prettier](https://prettier.io/)

[Storybook](https://storybook.js.org/)

[Scalable Architecture](https://dev.to/alexeagleson/how-to-build-scalable-architecture-for-your-nextjs-project-2pb7)

[Difference Between Casings](https://www.freecodecamp.org/news/snake-case-vs-camel-case-vs-pascal-case-vs-kebab-case-whats-the-difference/)

[Using React Context for State Management](https://vercel.com/guides/react-context-state-management-nextjs)

[MAD9014 Conventions](https://mad9014.github.io/f2023/conventions/)

[Google HTML/CSS Style Guide](https://google.github.io/styleguide/htmlcssguide.html#CSS)

[CKAN](https://docs.ckan.org/en/2.9/contributing/css.html)

[Project Guidelines](https://github.com/elsewhencode/project-guidelines)
