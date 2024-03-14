'use client';

import MockupContent from '@/components/MockupContent/MockupContent.jsx';
import MockupGallery from '@/components/MockupGallery/MockupGallery.jsx';
import MockupHeader from '@/components/MockupHeader/MockupHeader.jsx';
import MockupScreenLink from '@/components/MockupScreenLink/MockupScreenLink.jsx';
import PhoneMockup from '@/components/PhoneMockup/PhoneMockup.jsx';
import Image from 'next/image';
import config from '../../museumConfig.js';
import styles from './page.module.css';

function CheckList() {
  const arr = [1, 2, 3, 4];
  return (
    <div className={styles.grid}>
      <div className={styles.gridSeparator}>
        <h2>Details</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste,
          dolorum voluptatum, fugit ut nesciunt consequuntur dolorem assumenda
          autem quo animi quas atque officia, dolore vero magnam eveniet
          consectetur temporibus! Dolore.
        </p>
      </div>
      <div className={styles.gridSeparator}>
        <h2>Mockup</h2>
        <PhoneMockup>
          <MockupHeader
            image={'./artifact-canadair.webp'}
            alt={'Canadair Sabre'}
            title={'Canadair Sabre'}
          />
          <div className={styles.contentGrid}>
            <MockupScreenLink
              icon="fa-location-dot"
              title="Location"
              line={true}
            />
            <MockupContent>
              <h4>Highlights:</h4>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
                voluptatum officiis, at saepe, similique omnis nostrum
                consequatur id eius reiciendis fuga quod perferendis aspernatur
                architecto praesentium magnam perspiciatis nesciunt beatae.
              </p>
            </MockupContent>
            <MockupContent>
              <h4>Image Gallery:</h4>
            </MockupContent>
            <MockupGallery>
              {arr.map((item, index) => {
                return (
                  <Image
                    key={index}
                    src="./artifact-canadair.webp"
                    alt="Canadair Sabre"
                    width={300}
                    height={180}
                  />
                );
              })}
            </MockupGallery>
            <MockupContent>
              <h4>History:</h4>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
                voluptatum officiis, at saepe, similique omnis nostrum
                consequatur id eius reiciendis fuga quod perferendis aspernatur
                architecto praesentium magnam perspiciatis nesciunt beatae.
              </p>
            </MockupContent>
            <MockupContent>
              <h4>Provenance:</h4>
              <span>Purchase</span>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
                voluptatum officiis, at saepe, similique omnis nostrum
                consequatur id eius reiciendis fuga quod perferendis aspernatur
                architecto praesentium magnam perspiciatis nesciunt beatae.
              </p>
            </MockupContent>
            <MockupContent>
              <h4>Technical Information:</h4>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
                voluptatum officiis, at saepe, similique omnis nostrum
                consequatur id eius reiciendis fuga quod perferendis aspernatur
                architecto praesentium magnam perspiciatis nesciunt beatae.
              </p>
            </MockupContent>
            <MockupContent>
              <Image
                src="./artifact-canadair.webp"
                alt="Canadair Sabre"
                width={300}
                height={180}
              />
            </MockupContent>
          </div>
        </PhoneMockup>
      </div>
      <div className={styles.gridSeparator}>
        <h2>Checklist</h2>
        <form>
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
        </form>
      </div>
    </div>
  );
}

export default CheckList;
