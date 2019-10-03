import surveySubmissions from '../surveySubmissions';
import { SurveySubmission } from '../../actions/ActionTypes';

describe('reducers', () => {
  describe('surveySubmissions', () => {
    const baseState = {
      actionGrant: [],
      pagination: {},
      items: [],
      byId: {}
    };

    it('SurveySubmission.ADD.SUCCESS adds survey id to submission object', () => {
      const prevState = baseState;
      const action = {
        type: SurveySubmission.ADD.SUCCESS,
        meta: {
          surveyId: 9
        },
        payload: {
          result: 3,
          entities: {
            surveySubmissions: {
              3: {
                id: 3,
                test: 'abc'
              }
            }
          }
        }
      };
      expect(surveySubmissions(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
        items: [3],
        byId: {
          3: {
            id: 3,
            test: 'abc',
            survey: 9
          }
        }
      });
    });
  });
});
