import cx from 'classnames';
import { createRef, Component } from 'react';
import { Helmet } from 'react-helmet-async';
import InfiniteScroll from 'react-infinite-scroller';
import { Link } from 'react-router-dom';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { Company } from 'app/models';
import utilities from 'app/styles/utilities.css';
import styles from './CompaniesPage.css';
import type { ElementRef } from 'react';

type Props = {
  companies: Array<Company>;
  fetchMore: () => void;
  showFetchMore: () => void;
  hasMore: boolean;
  fetching: boolean;
};

const CompanyItem = ({ company }: Company) => {
  return (
    <div className={styles.companyItem}>
      <div className={styles.companyItemContent}>
        <div className={styles.companyLogoContainer}>
          <Link to={`/companies/${company.id}`}>
            <div className={styles.companyLogo}>
              {
                <Image
                  src={company.logo}
                  placeholder={company.logoPlaceholder}
                />
              }
            </div>
          </Link>
        </div>
        <Flex className={styles.companyInfo}>
          <Flex column alignItems="center">
            <Icon name="briefcase" size={20} />
            <span>{company.joblistingCount}</span>
          </Flex>
          {company.website && (
            <div className={styles.iconLink}>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Flex column alignItems="center">
                  <Icon
                    name="at-circle"
                    size={20}
                    style={{
                      color: 'var(--lego-link-color)',
                    }}
                  />
                  <span>Link her</span>
                </Flex>
              </a>
            </div>
          )}
          <Flex column alignItems="center">
            <Icon name="calendar-clear" size={20} />
            <span>{company.eventCount}</span>
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

type CompanyListProps = {
  companies: Array<Company>;
};

const CompanyList = ({ companies = [] }: CompanyListProps) => (
  <div className={styles.companyList}>
    {companies.map((company, id) => (
      <CompanyItem key={id} company={company} />
    ))}
  </div>
);

type State = {
  expanded: boolean;
};

class CompaniesPage extends Component<Props, State> {
  state = {
    expanded: false,
  };
  top = createRef<ElementRef<'h2'>>();

  render() {
    const { props } = this;
    return (
      <div className={styles.root}>
        <Helmet title="Bedrifter" />
        <h2 ref={this.top} className={styles.heading}>
          Bedrifter
        </h2>
        <div>
          <p className={styles.infoText}>
            Vil du jobbe som in-house utvikler i din drømmebedrift? Ser du for
            deg en hverdag som konsulent på oppdrag hos de kuleste kundene? Er
            sikkerhet din greie, eller drømmer du om å drive med spillutvikling
            på heltid? På denne siden har vi samlet et utvalg potensielle
            arbeidsgivere for deg som student, som gjenspeiler mangfoldet du har
            i jobbmuligheter.
          </p>
          {!this.state.expanded && (
            <button
              className={cx(styles.readMore, 'accordion')}
              onClick={() => {
                this.setState({
                  expanded: true,
                });
              }}
            >
              Vis mer
            </button>
          )}
          <div className={this.state.expanded ? ' ' : utilities.hiddenOnMobile}>
            <p className={styles.infoText}>
              Trykk deg inn på en bedrift for å se hva slags type bedrift det
              er, les mer om hva de jobber med og se hvor de holder til. Bla deg
              gjennom en oversikt over tidligere eller kommende arrangementer og
              se hvem som har jobbannonser ute for øyeblikket. Hvis du vil lese
              mer om bedriften så kan du navigere deg til nettsiden deres via
              linken.
            </p>

            <p className={styles.infoText}>
              Savner du en bedrift? Savner du noe informasjon om en bedrift? Ta
              kontakt med Bedkom, vi tar gjerne imot innspill!
            </p>
            <button
              className={cx(styles.readMore, 'accordion')}
              onClick={() => {
                this.setState({
                  expanded: false,
                });
                this.top.current && this.top.current.scrollIntoView();
              }}
            >
              Vis mindre
            </button>
          </div>
        </div>
        <div className={styles.iconInfoPlacement}>
          <Flex>
            <Icon name="briefcase" size={25} />
            <span className={styles.iconInfo}> Aktive jobbannonser</span>
          </Flex>
          <Flex>
            <Icon name="at-circle" size={25} />
            <span className={styles.iconInfo}> Nettside</span>
          </Flex>
          <Flex>
            <Icon name="calendar-clear" size={25} />
            <span className={styles.iconInfo}> Kommende arrangementer</span>
          </Flex>
        </div>
        <div id="nav" className={styles.navigationBar} />
        <InfiniteScroll
          element="div"
          hasMore={props.hasMore}
          loadMore={() => props.hasMore && !props.fetching && props.fetchMore()}
          initialLoad={false}
          loader={<LoadingIndicator loading />}
        >
          <CompanyList companies={props.companies} />
        </InfiniteScroll>
      </div>
    );
  }
}

export default CompaniesPage;