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

describe('Plot e2e test', () => {
  const plotPageUrl = '/plot';
  const plotPageUrlPattern = new RegExp('/plot(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const plotSample = {};

  let plot;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/plots+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/plots').as('postEntityRequest');
    cy.intercept('DELETE', '/api/plots/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (plot) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/plots/${plot.id}`,
      }).then(() => {
        plot = undefined;
      });
    }
  });

  it('Plots menu should load Plots page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('plot');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Plot').should('exist');
    cy.url().should('match', plotPageUrlPattern);
  });

  describe('Plot page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(plotPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Plot page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/plot/new$'));
        cy.getEntityCreateUpdateHeading('Plot');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', plotPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/plots',
          body: plotSample,
        }).then(({ body }) => {
          plot = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/plots+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/plots?page=0&size=20>; rel="last",<http://localhost/api/plots?page=0&size=20>; rel="first"',
              },
              body: [plot],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(plotPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Plot page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('plot');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', plotPageUrlPattern);
      });

      it('edit button click should load edit Plot page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Plot');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', plotPageUrlPattern);
      });

      it('edit button click should load edit Plot page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Plot');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', plotPageUrlPattern);
      });

      it('last delete button click should delete instance of Plot', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('plot').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', plotPageUrlPattern);

        plot = undefined;
      });
    });
  });

  describe('new Plot page', () => {
    beforeEach(() => {
      cy.visit(`${plotPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Plot');
    });

    it('should create an instance of Plot', () => {
      cy.get(`[data-cy="cultivatedArea"]`).type('1624').should('have.value', '1624');

      cy.get(`[data-cy="name"]`).type('Team-oriented').should('have.value', 'Team-oriented');

      cy.get(`[data-cy="location"]`).type('extensible Zloty 24/365').should('have.value', 'extensible Zloty 24/365');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        plot = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', plotPageUrlPattern);
    });
  });
});
