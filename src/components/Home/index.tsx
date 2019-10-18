import React, { useContext, useState, useEffect } from 'react';
import { compose } from 'recompose';
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification,
  AuthUser,
} from '../Session';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { FirebaseContext } from '../Firebase';

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <p>The Home Page is accessible by every signed in user.</p>
    <Messages />
  </div>
);

type Message = {
  uid: string;
  username: string;
  text: string;
  createdAt: string;
  editedAt: string;
  userId: string;
};

const Messages = () => {
  const firebase = useContext(FirebaseContext);
  const authUser = useContext(AuthUserContext);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setLoading(true);
    firebase!
      .messages()
      .orderByChild('createdAt')
      .limitToLast(limit)
      .on('value', snapshot => {
        const messageObject = snapshot.val();

        if (messageObject) {
          const messageList = Object.keys(messageObject).map<Message>(key => ({
            ...messageObject[key],
            uid: key,
          }));
          setMessages(messageList);
          setLoading(false);
        } else {
          setMessages(null);
          setLoading(true);
        }
      });
    return () => {
      firebase!.messages().off();
    };
  }, [firebase, limit]);

  const onRemoveMessage = (uid: string) => {
    firebase!.message(uid).remove();
  };

  const onEditMessage = (message: Message, text: string) => {
    const { uid, ...messageSnapshot } = message;

    firebase!.message(message.uid).set({
      ...messageSnapshot,
      text,
      editedAt: firebase!.serverValue.TIMESTAMP,
    });
  };

  return (
    <div>
      {loading && <div>Loading ...</div>}
      {!loading && messages && (
        <button
          type='button'
          onClick={() => setLimit(prevLimit => prevLimit + 10)}
        >
          Load more messages
        </button>
      )}
      {messages ? (
        <MessageList
          messages={messages}
          onRemoveMessage={onRemoveMessage}
          onEditMessage={onEditMessage}
        />
      ) : (
        <div>There are no messages ...</div>
      )}
      <Formik
        initialValues={{
          text: '',
        }}
        validate={values => {
          let errors: { text?: string } = {};
          if (!values.text) {
            errors.text = 'Text required';
          }
          return errors;
        }}
        onSubmit={(values, actions) => {
          firebase!
            .messages()
            .push({
              text: values.text,
              username: authUser!.username,
              userId: authUser!.uid,
              createdAt: firebase!.serverValue.TIMESTAMP,
            })
            .then(
              () => {
                actions.setSubmitting(false);
                actions.resetForm();
              },
              error => {
                actions.setSubmitting(false);
                actions.setStatus({ msg: error.message });
              },
            );
        }}
        render={({ status, isValid, isSubmitting }) => (
          <Form>
            <Field
              type='text'
              name='text'
              className='Message-input'
              component='textarea'
              cols='40'
              rows='4'
              placeholder='Enter your message'
            />
            <ErrorMessage name='text' component='div' />
            {status && status.msg && <div>{status.msg}</div>}
            <button type='submit' disabled={isSubmitting || !isValid}>
              Send
            </button>
          </Form>
        )}
      />
    </div>
  );
};

type MessageListProps = {
  messages: Message[];
  onRemoveMessage: (uid: string) => void;
  onEditMessage: (message: Message, text: string) => void;
};

const MessageList = ({
  messages,
  onRemoveMessage,
  onEditMessage,
}: MessageListProps) => {
  return (
    <ul className='Message-list'>
      {messages.map(message => (
        <MessageItem
          key={message.uid}
          message={message}
          onRemoveMessage={onRemoveMessage}
          onEditMessage={onEditMessage}
        />
      ))}
    </ul>
  );
};

type MessageItemProps = {
  message: Message;
  onRemoveMessage: (uid: string) => void;
  onEditMessage: (message: Message, text: string) => void;
};

const MessageItem = ({
  message,
  onRemoveMessage,
  onEditMessage,
}: MessageItemProps) => {
  const authUser = useContext(AuthUserContext);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState();

  const onToggleEditMode = () => {
    setEditMode(!editMode);
    setEditText(message.text);
  };

  const onChangeEditText = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setEditText(event.currentTarget.value);
  };

  const onSaveEditText = () => {
    onEditMessage(message, editText);
    setEditMode(false);
  };

  return (
    <li>
      {editMode ? (
        <textarea
          className='Message-input'
          cols={40}
          rows={4}
          value={editText}
          onChange={onChangeEditText}
        />
      ) : (
        <span>
          <strong>{message.username}:</strong> {message.text}{' '}
          {message.editedAt && <span>(Edited)</span>}
        </span>
      )}
      {authUser!.uid === message.userId && (
        <div>
          {editMode ? (
            <span>
              <button onClick={onSaveEditText}>Save</button>
              <button onClick={onToggleEditMode}>Reset</button>
            </span>
          ) : (
            <button onClick={onToggleEditMode}>Edit</button>
          )}
          {!editMode && (
            <button type='button' onClick={() => onRemoveMessage(message.uid)}>
              Delete
            </button>
          )}
        </div>
      )}
    </li>
  );
};
const condition = (authUser: AuthUser | null) => !!authUser;
export default compose(
  withEmailVerification,
  withAuthorization(condition),
)(HomePage);
