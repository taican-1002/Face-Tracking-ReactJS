import React, { useState, useEffect } from "react";
// import "mind-ar/dist/mindar-face.prod.js";
// import "aframe";
// import "mind-ar/dist/mindar-face-aframe.prod.js";
import MindARViewer from "./mindar-viewer";
import axios from "axios";

function App() {
  const [started, setStarted] = useState(false);
  const [items, setItems] = useState([]);
  const [gltfFiles, setGltfFiles] = useState([]);
  const [nameFiles, setNameFiles] = useState([]);
  const [visibles, setVisibles] = useState([]);

  const abc = "0.008 0.008 0.008";

  const getData = async () => {
    await axios
      .get(process.env.REACT_APP_BASE_URL)
      .then((res) => {
        console.log(res.data);
        setItems(res.data.data);
        for (let i = 0; i < res.data.data.length; i++) {
          gltfFiles.push(
            res.data.data[i].fileList.find((ele) => ele.path.includes(".gltf"))
          );
          nameFiles.push(res.data.data[i].name);
          visibles.push(res.data.data[i].name);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="App">
      <div className="app_container">
        {!started && (
          <button
            onClick={() => {
              setStarted(true);
            }}
          >
            Start
          </button>
        )}
        {started && (
          <button
            onClick={() => {
              setStarted(false);
            }}
          >
            Stop
          </button>
        )}
      </div>

      {started && (
        <div className="container">
          <MindARViewer
            items={items}
            gltfFiles={gltfFiles}
            nameFiles={nameFiles}
            visibles={visibles}
            getData={getData}
            setVisibles={(value) => setVisibles(value)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
