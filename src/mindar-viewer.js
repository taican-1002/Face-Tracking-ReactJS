import React, { useEffect, useRef, useState } from "react";

export default (props) => {
  const { items, gltfFiles, nameFiles, visibles, getData, setVisibles } = props;
  const sceneRef = useRef(null);

  console.log("gltfFiles: ", gltfFiles);
  console.log("nameFiles: ", nameFiles);

  useEffect(() => {
    getData();
    const sceneEl = sceneRef.current;
    const arSystem = sceneEl.systems["mindar-face-system"];
    sceneEl.addEventListener("renderstart", () => {
      arSystem.start(); // start AR
      setVisibles(visibles.fill(false));
      const setVisible = (button, entities, visible) => {
        if (visible) {
          button?.classList.add("selected");
        } else {
          button?.classList.remove("selected");
        }
        entities?.forEach((entity) => {
          entity?.setAttribute("visible", visible);
          console.log(entity.getAttribute("visible"));
          console.log(entity.getAttribute("position"));
          console.log(entity.getAttribute("rotation"));
          console.log(entity.getAttribute("scale"));
        });
      };
      nameFiles.forEach((item, index) => {
        const button = document.querySelector("#" + item);
        const entities = document.querySelectorAll("#" + item + "-entity");
        setVisible(button, entities, visibles[index]);
        button?.addEventListener("click", () => {
          visibles[index] = !visibles[index];
          setVisible(button, entities, visibles[index]);
        });
      });
    });

    return () => {
      arSystem.stop();
    };
  }, []);
  return (
    <div className="example-container">
      <div className="options-panel">
        {items.map((item) => (
          <img
            key={item.id}
            id={item.name}
            src={
              process.env.REACT_APP_URL +
              item.id +
              "/" +
              item.avatar.path.slice(48, item.avatar.path.length)
            }
          />
        ))}
      </div>
      <a-scene
        ref={sceneRef}
        className="scene"
        mindar-face
        embedded
        color-space="sRGB"
        renderer="colorManagement: true, physicallyCorrectLights"
        vr-mode-ui="enabled: false"
        device-orientation-permission-ui="enabled: false"
      >
        <a-assets>
          <a-asset-item
            id="headModel"
            src="https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.1.5/examples/face-tracking/assets/sparkar/headOccluder.glb"
          ></a-asset-item>
          {items &&
            items.map((item, index) => {
              const gltfFile = item.fileList.find((ele) =>
                ele.originalname.includes(".gltf")
              );
              return (
                <a-asset-item
                  key={index}
                  id={index}
                  src={
                    process.env.REACT_APP_URL +
                    item.id +
                    "/" +
                    gltfFile.path.slice(48, gltfFile.path.length)
                  }
                ></a-asset-item>
              );
            })}
        </a-assets>
        <a-camera active="false" position="0 0 0"></a-camera>
        <a-entity mindar-face-target="anchorIndex: 168">
          <a-gltf-model
            mindar-face-occluder
            position="0 -0.3 0.15"
            rotation="0 0 0"
            scale="0.065 0.065 0.065"
            src="#headModel"
          ></a-gltf-model>
        </a-entity>
        {items.map((item, index) => (
          <a-entity
            mindar-face-target={`anchorIndex: ${item.index}`}
            key={index}
          >
            <a-gltf-model
              id={`${item.name}-entity`}
              position={
                `${item.positionX}` +
                " " +
                `${item.positionY}` +
                " " +
                `${item.positionZ}`
              }
              rotation={
                `${item.rotationX}` +
                " " +
                `${item.rotationY}` +
                " " +
                `${item.rotationZ}`
              }
              scale={
                `${item.scaleX}` +
                " " +
                `${item.scaleY}` +
                " " +
                `${item.scaleZ}`
              }
              src={`#${index}`}
              visible="false"
            ></a-gltf-model>
          </a-entity>
        ))}
      </a-scene>
    </div>
  );
};
