import React from "react";
import styled from "@emotion/styled";

function DragAndDropQuestion() {
  return (
    <Wrapper>
      <div className="label">
        <h2>Drag & Drop Questions</h2>
        <h3>Drag the correct option from the given items, and drop the appropriate blank</h3>
      </div>
      <div className="dnd_content">
        <div className="options drag_items">
          <div className="option" draggable>If</div>
          <div className="option" draggable>Then</div>
          <div className="option" draggable>And</div>
          <div className="option" draggable>Or</div>
          <div className="option" draggable>But</div>
        </div>
        <ol className="blanks">
          <li><span>_______</span> Fire Sprinkler is on <span>_______</span> Water Valve is on</li>
          <li><span>_______</span> Heater is on <span>_______</span> Air Conditioner is of.</li>
        </ol>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  .label {
    margin: 0;
    padding: 0;
    line-height: 0.8rem;
    h2, h3 {
        font-weight: normal;
        line-height: 1.3rem;
    }
  }

  .dnd_content {
    .options {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      .option {
        padding: 5px 10px;
        background-color: #D9E5FE;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);
      }
    }
  }
`;

export default DragAndDropQuestion;
