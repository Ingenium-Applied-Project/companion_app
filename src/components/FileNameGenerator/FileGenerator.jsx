'use client';
import React, { useState } from 'react';
import './FileGenerator.css';

const areas = [
  // array of area names for the dropdown menu
  'Exhibition A',
  'Exhibition B',
  'Exhibition C',
  'Exhibition D',
  'Exhibition E',
  'Exhibition F',
  'Exhibition G',
  'Exhibition H',
  'Exhibition I',
  'Exhibition J',
  'Exhibition K',
];

const areaNameMapping = {
  // object with key-value pairs of area names and their corresponding exhibition names
  'Exhibition A': 'Early Aviation',
  'Exhibition B': 'First World War',
  'Exhibition C': 'Northern And Bush Flight',
  'Exhibition D': 'Canada In Space',
  'Exhibition E': 'Life In Orbit: The International Space Station',
  'Exhibition F': 'Early Travel And Transport',
  'Exhibition G': 'Commercial Flight',
  'Exhibition H': 'Eyes On The Skies',
  'Exhibition I': 'Second World War',
  'Exhibition J': 'Vertical Flight',
  'Exhibition K': 'Cold War',
};

const FileGenerator = () => {
  const [activeTab, setActiveTab] = useState('screen'); // eslint-disable-line no-unused-vars
  const [selectedArea, setSelectedArea] = useState(''); // eslint-disable-line no-unused-vars
  const [areaName, setAreaName] = useState(''); // eslint-disable-line no-unused-vars
  const [aircraft, setAircraft] = useState(''); // eslint-disable-line no-unused-vars
  const [language, setLanguage] = useState('EN'); // eslint-disable-line no-unused-vars
  const [fullFileName, setFullFileName] = useState(''); // eslint-disable-line no-unused-vars
  const [copySuccess, setCopySuccess] = useState(false);

  const handleAreaChange = (e) => {
    const area = e.target.value;
    setSelectedArea(area);
    setAreaName(areaNameMapping[area] || '');
  };

  const handleAreaNameChange = (e) => {
    setAreaName(e.target.value);
  };

  const handleAircraftChange = (e) => {
    setAircraft(e.target.value);
  };

  const handleTabChange = (tabs) => {
    setActiveTab(tabs);
  };

  const handleLanguage = (e) => {
    setLanguage(e.target.value);
  };

  const handleFullFileNameChange = (e) => {
    setFullFileName(e.target.value);
  };

  const handleGenerateScreenFileName = () => {
    const fileName = `WA-${selectedArea}-${areaName}-${aircraft}`.replace(
      /\s+/g,
      ''
    );
    setFullFileName(fileName);
  };

  const handleGenerateImageFileName = () => {
    const fileName =
      `WA-${selectedArea}-${areaName}-${language}-${aircraft}`.replace(
        /\s+/g,
        ''
      );
    setFullFileName(fileName);
  };

  const handleGenerateAudioFileName = () => {
    const fileName =
      `WA-${selectedArea}-${areaName}-${language}-${aircraft}`.replace(
        /\s+/g,
        ''
      );
    setFullFileName(fileName);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullFileName);
    setCopySuccess(true);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000); // set copySuccess to false after 2 seconds
  };

  return (
    <div className="container">
      <div className="tabs">
        <button
          className={activeTab === 'screen' ? 'active' : ''} // if activeTab is equal to 'screen' then add the class 'active' else add an empty string
          onClick={() => handleTabChange('screen')} // when the button is clicked, call the handleTabChange function with the argument 'screen'
        >
          Screen
        </button>
        <button
          className={activeTab === 'image' ? 'active' : ''}
          onClick={() => handleTabChange('image')}
        >
          Image
        </button>
        <button
          className={activeTab === 'audio' ? 'active' : ''}
          onClick={() => handleTabChange('audio')}
        >
          Audio
        </button>
      </div>
      {/* Screen tab */}
      <div
        className="tab-content"
        style={{ display: activeTab === 'screen' ? 'flex' : 'none' }}
      >
        <div className="inputSection">
          <div className="areaLabel">
            <label>Area </label>
            <select value={selectedArea} onChange={handleAreaChange}>
              <option value=""> Select Area </option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="nameLabel">
            <label>Name</label>
            <input
              type="text"
              value={areaName}
              onChange={handleAreaNameChange}
            />
          </div>

          <div className="aircraftLabel">
            <label>Aircraft</label>
            <input
              type="text"
              value={aircraft}
              onChange={handleAircraftChange}
            />
          </div>
        </div>

        <div className="fullFileInput">
          <input
            type="text"
            value={fullFileName}
            onChange={handleFullFileNameChange}
          />
          <div className="buttonSection">
            <button onClick={handleGenerateScreenFileName}>Generate</button>
          </div>
        </div>
      </div>
      {/* Image tab */}
      <div
        className="tab-content"
        style={{ display: activeTab === 'image' ? 'flex' : 'none' }}
      >
        <div className="inputSection">
          <div className="areaLabel">
            <label>Area </label>
            <select value={selectedArea} onChange={handleAreaChange}>
              <option value=""> Select Area </option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="nameLabel">
            <label>Name</label>
            <input
              type="text"
              value={areaName}
              onChange={handleAreaNameChange}
            />
          </div>

          <div className="languageLabel">
            <label>Language</label>
            <select value={language} onChange={handleLanguage}>
              <option value="EN">EN</option>
              <option value="FR">FR</option>
            </select>
          </div>

          <div className="aircraftLabel">
            <label>Aircraft</label>
            <input
              type="text"
              value={aircraft}
              onChange={handleAircraftChange}
            />
          </div>
        </div>
        <div className="fullFileInput">
          <input
            type="text"
            value={fullFileName}
            onChange={handleFullFileNameChange}
          />
          <div className="buttonSection">
            <button onClick={handleGenerateImageFileName}>Generate</button>
          </div>
        </div>
      </div>
      {/* Audio tab */}
      <div
        className="tab-content"
        style={{ display: activeTab === 'audio' ? 'flex' : 'none' }}
      >
        <div className="inputSection">
          <div className="areaLabel">
            <label>Area </label>
            <select value={selectedArea} onChange={handleAreaChange}>
              <option value=""> Select Area </option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="nameLabel">
            <label>Name</label>
            <input
              type="text"
              value={areaName}
              onChange={handleAreaNameChange}
            />
          </div>

          <div className="languageLabel">
            <label>Language</label>
            <select value={language} onChange={handleLanguage}>
              <option value="EN">EN</option>
              <option value="FR">FR</option>
            </select>
          </div>

          <div className="aircraftLabel">
            <label>Aircraft</label>
            <input
              type="text"
              value={aircraft}
              onChange={handleAircraftChange}
            />
          </div>
        </div>

        <div className="fullFileInput">
          <input
            type="text"
            value={fullFileName}
            onChange={handleFullFileNameChange}
          />
          <div className="buttonSection">
            <button onClick={handleGenerateAudioFileName}>Generate</button>
          </div>
        </div>
      </div>

      <div className="copySection">
        <button onClick={handleCopy}>Copy</button>
        {copySuccess && (
          <span style={{ color: 'green' }}>Copied to clipboard!</span>
        )}
      </div>
    </div>
  );
};

export default FileGenerator;
