

import styled from '@mui/styled-engine-sc';
import SendIcon from '@mui/icons-material/Send';
import { Button, TextField } from '@mui/material';

const ChatContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MessageList = styled('ul')`
  overflow: auto;
  flex-grow: 1;
`;

const Message = styled('li')`
  margin-bottom: 10px;
`;

const Input = styled(TextField)`
  flex-grow: 1;
`;

const SendButton = styled(Button)`
  margin-left: 10px;
`;
export { ChatContainer, MessageList, Message, Input, SendButton };

