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

**Whenever logic is being used in more than one component, it’s recommended to extract the logic into a custom hook. This custom hook encapsulates the logic and returns the desired value on passing different inputs. This makes a developer follow DRY(don’t repeat yourself) and removes the code redundancy in the application.**

4. Naming Convention - Suggestion 1

**Always use meaningful names**

- Under the app directory, `Kebab` case. We use `Kebab` in this scenario for Routing purposes. Eg, `app.jsx`, `not-found.jsx`.
- Under the components directory, `pascal` case. We use `Pascal` for components file names and components names itself. Eg for files, `Button.jsx`, `MyContainer.jsx`. Eg for components, `Button`, `MyContainer`.
- Component style use `Pascal` with `dot notation`. Eg, `Button.modules.css`. Every css file for component should include `.module.css`.
- Hooks must use `camel` case and have the prefix `use`. Eg, `useSearch.jsx`.
- Providers must use `camel` case and have the suffix `Provider`. Eg, `searchProvider.jsx`.
- [Resource One](https://medium.com/@mirazhs/naming-conventions-in-next-js-boosting-seo-and-code-maintainability-d4150fe7e6e#:~:text=In%20NextJS%2C%20it%20is%20recommended,js%20%2C%20use%20about%2Dus.). [Resource Two](https://medium.com/@hiro08gh/next-js-naming-conventions-are-checked-with-eslint-rules-946371d67882).

4. Naming Convention - Suggestion 2

**Always use meaningful names**

- Non-React Folders and Files: `Kebab`. Eg for files, `app.jsx`, `my-container.jsx`. Eg for folders, `app`, `my-container`.
- React (inside components folder): `PascalCase`. Eg, `App`, `MyContainer`
- Component style use `dot notation`. Eg, `style.modules.css`
- [Resource One](https://medium.com/@mirazhs/naming-conventions-in-next-js-boosting-seo-and-code-maintainability-d4150fe7e6e#:~:text=In%20NextJS%2C%20it%20is%20recommended,js%20%2C%20use%20about%2Dus.). [Resource Two](https://medium.com/@hiro08gh/next-js-naming-conventions-are-checked-with-eslint-rules-946371d67882).

5. Exports from files can be either as variable or default exports, but please stick to naming the object before using `export default` to avoid anonymous module names in stack traces and React dev tools.

6. Code Formatting

- Trailing Comma to es5 standard.
- Tab Width has to be 2 spaces.
- A semicolon is **REQUIRED** at the end of each statement.
- String literals must use Single Quotes.

**Prettier is pre-installed with the project and contains the default Code Formatting rules. Make use of it by running `yarn prettier`**

7. Proper Commenting

-Incorporate meaningful comments within your code to explain complex logic or why certain decisions were made. However, don't overdo it; code should be self-explanatory whenever possible.

## GitHub

1.

## Design - CSS

- Avoid hard coding colors. All colors from the design guideline should be pre-defined in the `root`. Please use them with respect.

- Try to avoid injecting styles via `style` attribute because it's impossible to build responsiveness with inline styles. Strive to only use Tailwind classes for sizing, spacing, and building grid layouts.

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

- Use [Storybook](https://storybook.js.org/) to Visualize UI Components

**To use run: `yarn storybook`**

## Resources

[NEXT.js](https://nextjs.org/)

[ESLint](https://eslint.org/)

[Prettier](https://prettier.io/)

[Storybook](https://storybook.js.org/)

[Scalable Architecture](https://dev.to/alexeagleson/how-to-build-scalable-architecture-for-your-nextjs-project-2pb7)

[Difference Between Casings](https://www.freecodecamp.org/news/snake-case-vs-camel-case-vs-pascal-case-vs-kebab-case-whats-the-difference/)
