import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'app/components/Button';
import Dropdown from 'app/components/Dropdown';
import Icon from 'app/components/Icon';
import Reactions from 'app/components/Reactions';
import Reaction from 'app/components/Reactions/Reaction';
import Time from 'app/components/Time';
import type { ActionGrant } from 'app/models';
import type { ID } from 'app/store/models';
import type Emoji from 'app/store/models/Emoji';
import type QuoteType from 'app/store/models/Quote';
import type { CurrentUser } from 'app/store/models/User';
import type { ContentTarget } from 'app/store/utils/contentTarget';
import styles from './Quotes.css';

type Props = {
  quote: QuoteType;
  deleteQuote: (id: ID) => Promise<void>;
  approve: (id: ID) => Promise<void>;
  unapprove: (id: ID) => Promise<void>;
  actionGrant: ActionGrant;
  toggleDisplayAdmin: () => void;
  displayAdmin: boolean;
  currentUser: CurrentUser;
  loggedIn: boolean;
  addReaction: (args: {
    emoji: string;
    contentTarget: ContentTarget;
  }) => Promise<void>;
  deleteReaction: (args: {
    reactionId: ID;
    contentTarget: ContentTarget;
  }) => Promise<void>;
  fetchEmojis: () => Promise<void>;
  fetchingEmojis: boolean;
  emojis: Emoji[];
};

const Quote = ({
  quote,
  deleteQuote,
  approve,
  unapprove,
  actionGrant,
  toggleDisplayAdmin,
  displayAdmin,
  emojis,
  addReaction,
  deleteReaction,
  fetchEmojis,
  fetchingEmojis,
  loggedIn,
}: Props) => {
  const [deleting, setDeleting] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  let mappedEmojis: (Emoji & { hasReacted: boolean; reactionId: ID })[] = [];

  if (!fetchingEmojis) {
    mappedEmojis = emojis.map((emoji) => {
      const foundReaction = quote.reactionsGrouped.find(
        (reaction) => emoji.shortCode === reaction.emoji && reaction.hasReacted
      );

      return foundReaction !== undefined
        ? {
            ...emoji,
            hasReacted: true,
            reactionId: foundReaction.reactionId,
          }
        : {
            ...emoji,
            hasReacted: false,
            reactionId: -1,
          };
    });
  }

  return (
    <li className={styles.singleQuote}>
      <div className={styles.leftQuote}>
        <i
          className="fa fa-quote-right"
          style={{
            fontSize: '100px',
            color: '#dbdbdb',
            marginRight: '30px',
            order: '0',
            height: '0',
          }}
        />
        <h3 className={styles.theQuote}>
          <Link to={`/quotes/${quote.id}`}>{quote.text}</Link>
        </h3>
      </div>

      <div className={styles.quoteBottom}>
        <span className={styles.quoteSource}>
          <i>- {quote.source}</i>
        </span>

        <div className={styles.bottomRow}>
          <div className={styles.quoteDate}>
            {<Time time={quote.createdAt} wordsAgo />}
          </div>

          <div className={styles.bottomRight}>
            <div className={styles.reactionCount}>
              <Button flat onClick={() => setShowReactions(!showReactions)}>
                <i
                  className="fa fa-reaction-o"
                  style={{
                    marginRight: '5px',
                  }}
                />
              </Button>
            </div>

            {actionGrant && actionGrant.includes('approve') && (
              <div className={styles.quoteAdmin}>
                <Dropdown
                  show={displayAdmin}
                  toggle={toggleDisplayAdmin}
                  closeOnContentClick
                  contentClassName="adminDropdown2"
                  triggerComponent={
                    <Icon
                      name="chevron-down-circle-outline"
                      className={styles.dropdownIcon}
                    />
                  }
                >
                  <Dropdown.List>
                    <Dropdown.ListItem>
                      <Button
                        flat
                        className="approveQuote"
                        onClick={() =>
                          quote.approved
                            ? unapprove(quote.id)
                            : approve(quote.id)
                        }
                      >
                        {quote.approved ? 'Fjern godkjenning' : 'Godkjenn'}
                      </Button>
                    </Dropdown.ListItem>
                    <Dropdown.Divider />
                    {!deleting ? (
                      <Dropdown.ListItem>
                        <Button
                          flat
                          onClick={(e) => {
                            if (e) {
                              e.preventDefault();
                              e.stopPropagation();
                            }

                            setDeleting(!deleting);
                          }}
                        >
                          Slett
                        </Button>
                      </Dropdown.ListItem>
                    ) : (
                      <Dropdown.ListItem>
                        <Button
                          flat
                          onClick={() => deleteQuote(quote.id)}
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          Er du sikker?
                        </Button>
                      </Dropdown.ListItem>
                    )}
                  </Dropdown.List>
                </Dropdown>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.quoteReactions}>
        <Reactions
          emojis={mappedEmojis}
          fetchEmojis={fetchEmojis}
          fetchingEmojis={fetchingEmojis}
          addReaction={addReaction}
          deleteReaction={deleteReaction}
          contentTarget={quote.contentTarget}
          loggedIn={loggedIn}
        >
          {quote.reactionsGrouped.map((reaction) => {
            return (
              <Reaction
                key={`reaction-${reaction.emoji}`}
                emoji={reaction.emoji}
                count={reaction.count}
                unicodeString={reaction.unicodeString}
                reactionId={reaction.reactionId}
                hasReacted={reaction.hasReacted}
                canReact={loggedIn}
                addReaction={addReaction}
                deleteReaction={deleteReaction}
                contentTarget={quote.contentTarget}
              />
            );
          })}
        </Reactions>
      </div>
    </li>
  );
};

export default Quote;
