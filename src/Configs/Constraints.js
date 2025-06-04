// Websocket Topics
export const wsTopics={
          addOrUpdateFriend: "friend:add-or-update",
          deleteFriend: "friend:delete",
          newFriendRequest: "friend-request:create",

          addOrUpdateTeam: "team:add-or-update",
          deleteTeam: "team:delete",

          addOrUpdateChannel: "channel:add-or-update",
          deleteChannel: "channel:delete",

          addTeamMembers: "team-member:add-many",
          deleteMember: "team-member:delete",

          newTeamRequest: "team-request:create",
          rejectTeamRequest: "team-request:reject",

          addOrUpdateMessage: "message:add-or-update",

          addOrUpdateMeeting: "meeting:add-or-update",
          deleteMeeting: "meeting:delete"
}

export const channelTypes={
          CHAT_CHANNEL: "CHAT_CHANNEL",
          VOICE_CHANNEL: "VOICE_CHANNEL"
}

export const teamRoles={
          LEADER: "LEADER",
          MEMBER: "MEMBER",
          LEAVE: "LEAVE"
}

// Tab Titles
export const tabTitles=["Members", "Pending Requests", "Channels","Settings"]

export const emojiCodes = ["❤️", "😀", "🙁", "🙂"];

// Message Types
export const messageTypes ={
          UNSEND: "UNSEND",
          TEXT: "TEXT",
          DOCUMENT: "DOCUMENT",
          IMAGE: "IMAGE",
          VIDEO: "VIDEO",
          AUDIO: "AUDIO",
          VOTING: "VOTING"
}



