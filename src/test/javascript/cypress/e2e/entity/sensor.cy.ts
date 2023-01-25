import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Sensor e2e test', () => {
  const sensorPageUrl = '/sensor';
  const sensorPageUrlPattern = new RegExp('/sensor(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const sensorSample = {};

  let sensor;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/sensors+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/sensors').as('postEntityRequest');
    cy.intercept('DELETE', '/api/sensors/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (sensor) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/sensors/${sensor.id}`,
      }).then(() => {
        sensor = undefined;
      });
    }
  });

  it('Sensors menu should load Sensors page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('sensor');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Sensor').should('exist');
    cy.url().should('match', sensorPageUrlPattern);
  });

  describe('Sensor page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(sensorPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Sensor page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/sensor/new$'));
        cy.getEntityCreateUpdateHeading('Sensor');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', sensorPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/sensors',
          body: sensorSample,
        }).then(({ body }) => {
          sensor = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/sensors+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/sensors?page=0&size=20>; rel="last",<http://localhost/api/sensors?page=0&size=20>; rel="first"',
              },
              body: [sensor],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(sensorPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Sensor page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('sensor');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', sensorPageUrlPattern);
      });

      it('edit button click should load edit Sensor page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Sensor');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', sensorPageUrlPattern);
      });

      it('edit button click should load edit Sensor page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Sensor');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', sensorPageUrlPattern);
      });

      it('last delete button click should delete instance of Sensor', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('sensor').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', sensorPageUrlPattern);

        sensor = undefined;
      });
    });
  });

  describe('new Sensor page', () => {
    beforeEach(() => {
      cy.visit(`${sensorPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Sensor');
    });

    it('should create an instance of Sensor', () => {
      cy.get(`[data-cy="name"]`).type('Stand-alone connecting').should('have.value', 'Stand-alone connecting');

      cy.get(`[data-cy="status"]`)
        .type('Armenian Buckinghamshire transitional')
        .should('have.value', 'Armenian Buckinghamshire transitional');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        sensor = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', sensorPageUrlPattern);
    });
  });
});
