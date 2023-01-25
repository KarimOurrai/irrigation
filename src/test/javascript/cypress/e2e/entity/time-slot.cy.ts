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

describe('TimeSlot e2e test', () => {
  const timeSlotPageUrl = '/time-slot';
  const timeSlotPageUrlPattern = new RegExp('/time-slot(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const timeSlotSample = {};

  let timeSlot;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/time-slots+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/time-slots').as('postEntityRequest');
    cy.intercept('DELETE', '/api/time-slots/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (timeSlot) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/time-slots/${timeSlot.id}`,
      }).then(() => {
        timeSlot = undefined;
      });
    }
  });

  it('TimeSlots menu should load TimeSlots page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('time-slot');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('TimeSlot').should('exist');
    cy.url().should('match', timeSlotPageUrlPattern);
  });

  describe('TimeSlot page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(timeSlotPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create TimeSlot page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/time-slot/new$'));
        cy.getEntityCreateUpdateHeading('TimeSlot');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', timeSlotPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/time-slots',
          body: timeSlotSample,
        }).then(({ body }) => {
          timeSlot = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/time-slots+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/time-slots?page=0&size=20>; rel="last",<http://localhost/api/time-slots?page=0&size=20>; rel="first"',
              },
              body: [timeSlot],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(timeSlotPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details TimeSlot page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('timeSlot');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', timeSlotPageUrlPattern);
      });

      it('edit button click should load edit TimeSlot page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TimeSlot');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', timeSlotPageUrlPattern);
      });

      it('edit button click should load edit TimeSlot page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('TimeSlot');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', timeSlotPageUrlPattern);
      });

      it('last delete button click should delete instance of TimeSlot', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('timeSlot').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', timeSlotPageUrlPattern);

        timeSlot = undefined;
      });
    });
  });

  describe('new TimeSlot page', () => {
    beforeEach(() => {
      cy.visit(`${timeSlotPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('TimeSlot');
    });

    it('should create an instance of TimeSlot', () => {
      cy.get(`[data-cy="startTime"]`).type('2023-01-24T15:01').blur().should('have.value', '2023-01-24T15:01');

      cy.get(`[data-cy="endTime"]`).type('2023-01-24T18:30').blur().should('have.value', '2023-01-24T18:30');

      cy.get(`[data-cy="status"]`).type('2023-01-24T09:11').blur().should('have.value', '2023-01-24T09:11');

      cy.get(`[data-cy="waterAmount"]`).type('66813').should('have.value', '66813');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        timeSlot = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', timeSlotPageUrlPattern);
    });
  });
});
