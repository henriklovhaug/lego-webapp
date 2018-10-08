// @flow
import React, { Component } from 'react';
import type { Element } from 'react';
import type { Event, Article } from 'app/models';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import { Link } from 'react-router';
import styles from './Pinned.css';

type Props = {
  item: Event | Article,
  url: string,
  meta: Element<'span'> | null
};

class Pinned extends Component<Props, *> {
  render() {
    const { item, url, meta } = this.props;
    return (
      <Flex column className={styles.pinned}>
        <h2 className="u-ui-heading">Festet oppslag</h2>
        <Flex column className={styles.innerPinned}>
          <Link to={url} className={styles.innerLinks}>
            <Image className={styles.img} src={item.cover} />
          </Link>
          <div className={styles.pinnedHeading}>
            <h2 className={styles.itemTitle}>
              <Link to={url}>{item.title}</Link>
            </h2>
            {meta}
          </div>
        </Flex>
      </Flex>
    );
  }
}

export default Pinned;
