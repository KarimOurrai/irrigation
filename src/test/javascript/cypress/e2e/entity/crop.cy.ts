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

describe('Crop e2e test', () => {
  const cropPageUrl = '/crop';
  const cropPageUrlPattern = new RegExp('/crop(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const cropSample = { type: 'Computers Paradigm' };

  let crop;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/crops+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/crops').as('postEntityRequest');
    cy.intercept('DELETE', '/api/crops/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (crop) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/crops/${crop.id}`,
      }).then(() => {
        crop = undefined;
      });
    }
  });

  it('Crops menu should load Crops page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('crop');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Crop').should('exist');
    cy.url().should('match', cropPageUrlPattern);
  });

  describe('Crop page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(cropPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Crop page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/crop/new$'));
        cy.getEntityCreateUpdateHeading('Crop');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cropPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/crops',
          body: cropSample,
        }).then(({ body }) => {
          crop = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/crops+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/crops?page=0&size=20>; rel="last",<http://localhost/api/crops?page=0&size=20>; rel="first"',
              },
              body: [crop],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(cropPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Crop page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('crop');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cropPageUrlPattern);
      });

      it('edit button click should load edit Crop page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Crop');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cropPageUrlPattern);
      });

      it('edit button click should load edit Crop page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Crop');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cropPageUrlPattern);
      });

      it('last delete button click should delete instance of Crop', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('crop').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', cropPageUrlPattern);

        crop = undefined;
      });
    });
  });

  describe('new Crop page', () => {
    beforeEach(() => {
      cy.visit(`${cropPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Crop');
    });

    it('should create an instance of Crop', () => {
      cy.get(`[data-cy="type"]`).type('programming').should('have.value', 'programming');

      cy.get(`[data-cy="waterAmount"]`).type('17514').should('have.value', '17514');

      cy.get(`[data-cy="duration"]`).type('12098').should('have.value', '12098');

      cy.get(`[data-cy="area"]`).type('77985').should('have.value', '77985');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        crop = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', cropPageUrlPattern);
    });
  });
});
