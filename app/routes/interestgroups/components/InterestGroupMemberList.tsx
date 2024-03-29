import { Flex, Icon, Modal } from '@webkom/lego-bricks';
import sortBy from 'lodash/sortBy';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import TextInput from 'app/components/Form/TextInput';
import { ProfilePicture } from 'app/components/Image';
import Tooltip from 'app/components/Tooltip';
import shared from 'app/components/UserAttendance/AttendanceModalContent.css';
import styles from './InterestGroupMemberList.css';
import type { GroupMembership } from 'app/models';
import type { PublicUser } from 'app/store/models/User';
import type { RoleType } from 'app/utils/constants';
import type { ReactNode } from 'react';

const nameStyleByRole: Partial<Record<RoleType, string>> = {
  leader: styles.leader,
  ['co-leader']: styles.coleader,
};

type RoleIconInfo = {
  iconStyle: string;
  name: string;
  tooltip: string;
};
const roleIconInfoByRole: Partial<Record<RoleType, RoleIconInfo>> = {
  leader: {
    iconStyle: styles.leadericon,
    name: 'star',
    tooltip: 'Leder',
  },
  ['co-leader']: {
    iconStyle: styles.coleadericon,
    name: 'star-outline',
    tooltip: 'Nestleder',
  },
};
const RoleIcon = ({ role }: { role: RoleType }) => {
  const info = roleIconInfoByRole[role];
  if (!info) return null;

  const { iconStyle, name, tooltip } = info;
  return (
    <Tooltip content={tooltip}>
      <Icon name={name} className={iconStyle} />
    </Tooltip>
  );
};

const ListedUser = ({ user, role }: { user: PublicUser; role: RoleType }) => (
  <li>
    <Flex alignItems="center" gap={10} className={shared.row}>
      <ProfilePicture size={30} user={user} />
      <RoleIcon role={role} />
      <Link to={`/users/${user.username}`}>
        <span className={nameStyleByRole[role]}>{user.fullName}</span>
      </Link>
    </Flex>
  </li>
);

// Reversed sort order
const SORT_ORDER = ['member', 'co_leader', 'leader'];
type Props = {
  children: ReactNode;
  memberships: GroupMembership[];
};
const InterestGroupMemberList = ({ memberships, children }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('');

  const toggleModal = () => setModalVisible(!modalVisible);

  const filteredMemberships = memberships.filter((membership) =>
    membership.user.fullName.toLowerCase().includes(filter.toLowerCase()),
  );
  const sorted = sortBy(filteredMemberships, ({ role }) =>
    SORT_ORDER.indexOf(role),
  ).reverse();

  return (
    <>
      <div onClick={toggleModal}>{children}</div>
      <Modal show={modalVisible} onHide={toggleModal}>
        <Flex column gap="var(--spacing-md)" className={shared.modal}>
          <h2>Medlemmer</h2>
          <TextInput
            type="text"
            prefix="search"
            placeholder="Søk etter navn"
            onChange={(e) => setFilter(e.target.value)}
          />

          <ul className={shared.list}>
            {sorted.map((membership) => (
              <ListedUser
                key={membership.user.id}
                user={membership.user}
                role={membership.role}
              />
            ))}
          </ul>
        </Flex>
      </Modal>
    </>
  );
};

export default InterestGroupMemberList;
