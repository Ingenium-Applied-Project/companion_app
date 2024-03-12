import config from '../museumConfig.js';

function CheckList() {
  return (
    <div>
      {/* <pre>{JSON.stringify(config.CASM.feature.checkList, '<br />')}</pre> */}
      <form>
        <fieldset>
          <legend>Checklist</legend>
          <ul>
            {config.CASM.feature.checkList.content.map((item, index) => {
              return (
                <li key={index}>
                  <input
                    type="checkbox"
                    id={index}
                    name={item.type}
                    value={item.type}
                  />
                  <label htmlFor={index}> {item.for}</label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </form>
    </div>
  );
}

export default CheckList;
