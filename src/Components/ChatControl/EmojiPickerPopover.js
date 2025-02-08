import EmojiPicker from "emoji-picker-react";
import { useRef, useState } from "react";
import { Overlay, Popover } from "react-bootstrap";

const EmojiPickerPopover=({handleEmojiPicker})=>{
          const [showEmojiPicker, setShowEmojiPicker] = useState(false);
          const target = useRef(null);
        
          return (
            <>
              <button ref={target} className="btn btn-sm btn-outline-warning" onClick={() => setShowEmojiPicker(prev => !prev)}>
                <i className="fa fa-smile-o"></i>
              </button>
              <Overlay target={target.current} show={showEmojiPicker} placement="top">
                {(props) => (
                  <Popover {...props} id="emoji-popover">
                    <Popover.Body>
                      <EmojiPicker onEmojiClick={(emojiData, e) => handleEmojiPicker(emojiData)} width={300} height={400}/>
                    </Popover.Body>
                  </Popover>
                )}
              </Overlay>
            </>
          );
}

export default EmojiPickerPopover;