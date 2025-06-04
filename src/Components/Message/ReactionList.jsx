import "./Message.css"

const ReactionList=({reactions, setReactions})=>{
          if(!reactions) return;
          const reactionList=new Set();
          reactions.forEach((reaction)=>{
                    reactionList.add(reaction.emojiCode);
          })
          if(reactionList.size>0){
                    return(
                              <div className="reaction" onClick={(e)=>setReactions(reactions)}>
                              {Array.from(reactionList).map(emojiCode=>emojiCode)} {reactions.length}
                              </div>
                    )
          }
}

export default ReactionList;
