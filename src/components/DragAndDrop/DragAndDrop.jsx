import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import styles from './DragAndDrop.module.css';
const fileTypes = ['JPG', 'PNG', 'GIF', 'WEBP', 'JPEG'];

function DragAndDrop() {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
  };

  return (
    <FileUploader
      handleChange={handleChange}
      name="file"
      types={fileTypes}
      className={styles.fileUploader}
    />
  );
}

export default DragAndDrop;
