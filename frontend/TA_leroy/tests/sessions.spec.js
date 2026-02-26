import { test, expect } from '../fixtures/pages.js';
import { SESSION_STATUS } from '../constants/sessionStatus.js';
import { FILTER_TYPE } from '../constants/filterType.js';
import { createSessionContext } from '../utils/sessionTestData.js';

//Cancellation of session not possible
//Ingelogd moeten zijn om bepaalde handelingen uit te kunnen voeren
//Na bewerken worden opgegeven halve uren opgeslagen als hele uren
//List page data assertions toevoegen

test.describe('Sessions feature', () => {

  test.beforeEach(async ({ loginPage, basePage }) => {
    //Succesvol inloggen en vervolgens uitkomen op de list page
    await loginPage.goToLoginPage();
    await basePage.assertUrlEndsWith('login');
    await loginPage.login(
      process.env.ADMIN_EMAIL_CORRECT,
      process.env.ADMIN_PASSWORD_CORRECT
    );
    await basePage.assertUrlEndsWith('list');
    await basePage.assertPageTitle("Training Sessions");
  });

test('1. Een succesvol toegevoegde session is zichtbaar op de list page en bevat daar de juiste data', async ({ listPage, addPage, basePage }) => {
  //Naar add page navigeren
  await listPage.clickAddSessionButton();

  //Session data aanmaken
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);
  await addPage.clickCreateSessionButton();

  //Checken of waarden op list page overeenkomen met toegevoegde session
  await basePage.assertUrlEndsWith('list');
  await listPage.assertSessionData(scenarioContextAddedSessions);
});

test('2. Een succesvol toegevoegde session is klikbaar op de list page en bevat de juiste data in de edit page', async ({ listPage, addPage, editPage }) => {
  //Naar add page navigeren
  await listPage.clickAddSessionButton();

  //Session data aanmaken
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);
  await addPage.clickCreateSessionButton();

  //Naar edit page navigeren en controleren of de juiste data is ingevuld
  await listPage.editSessionByClickOnTitle(scenarioContextAddedSessions.title);
  await editPage.assertSessionData(scenarioContextAddedSessions);
});

test('3. Een succesvol gewijzigde session is zichtbaar op de list page en bevat daar de juiste data --> De data van de oorspronkelijke sessie is niet meer zichtbaar', async ({ listPage, addPage, basePage, editPage }) => {
  //Naar add page navigeren
  await listPage.clickAddSessionButton();

  //Session data aanmaken
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);
  await addPage.clickCreateSessionButton();

  //Session data bewerken en opslaan
  await listPage.editSessionByClickOnTitle(scenarioContextAddedSessions.title);
  const scenarioContextEditedSessions = createSessionContext();
  await editPage.editSessionWithData(scenarioContextEditedSessions);
  await editPage.saveChanges();

  //Checken of waarden op list page overeenkomen met gewijzigde session
  await basePage.assertUrlEndsWith('list');
  await listPage.assertSessionData(scenarioContextEditedSessions);

  //Oorspronkelijke sessie data is niet meer zichtbaar op de list page
  await listPage.expectSessionNotPresent(scenarioContextAddedSessions.title);
});

test('4. Een succesvol gewijzigde session is klikbaar op de list page en bevat de juiste data in de edit page', async ({ listPage, addPage, editPage }) => {
  //Naar add page navigeren
  await listPage.clickAddSessionButton();

  //Session data aanmaken, naar edit page navigeren en checken of nu de data van aangemaakte sessie wordt getoond
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);
  await addPage.clickCreateSessionButton();
  await listPage.editSessionByClickOnTitle(scenarioContextAddedSessions.title);

  //Session data bewerken en opslaan
  const scenarioContextEditedSessions = createSessionContext();
  await editPage.editSessionWithData(scenarioContextEditedSessions);
  await editPage.saveChanges();

  //Controleren of de juiste data na edit is ingevuld
  await listPage.editSessionByClickOnTitle(scenarioContextEditedSessions.title);
  await editPage.assertSessionData(scenarioContextEditedSessions);
});


test('5. Een sessie kan succesvol worden verwijderd vanuit de list page', async ({ basePage, listPage, addPage }) => {
  //Naar add page navigeren
  await listPage.clickAddSessionButton();

  //Session data aanmaken
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);
  await addPage.clickCreateSessionButton();

  //Controleren of de juiste data na edit is ingevuld
  await listPage.deleteSessionByClickOnTrashIcon(scenarioContextAddedSessions.title);
  await listPage.confirmDelete();
  await listPage.deletePermanently();

  //Controleren of sessie niet meer in de lijst staat
  await basePage.assertUrlEndsWith('list');
  await listPage.expectSessionNotPresent(scenarioContextAddedSessions.title);
});

test('6. Een sessie kan succesvol worden verwijderd vanuit de edit page --> Redirect naar list page', async ({ basePage, listPage, addPage, editPage }) => {
  //Naar add page navigeren
  await listPage.clickAddSessionButton();

  //Session data aanmaken
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);
  await addPage.clickCreateSessionButton();

  //Sessie die zojuist is aangemaakt, verwijderen via edit page
  await listPage.editSessionByClickOnTitle(scenarioContextAddedSessions.title);
  await editPage.assertSessionData(scenarioContextAddedSessions);
  await editPage.clickDeleteSession();
  await editPage.confirmDelete();
  await editPage.confirmDeletePermanently();

  //Controleren of je op de list page bent en sessie niet meer in de lijst staat
  await basePage.assertUrlEndsWith('list');
  await listPage.expectSessionNotPresent(scenarioContextAddedSessions.title);
});

test('7. De status van een toegevoegde sessie kan niet worden gewijzigd naar "Cancelled"', async ({ basePage, listPage, addPage, editPage }) => {
  //Naar add page navigeren
  await listPage.clickAddSessionButton();

  //Session data aanmaken
  const scenarioContextAddedSessions = createSessionContext();
  await addPage.createSessionWithData(scenarioContextAddedSessions);
  await addPage.clickCreateSessionButton();

  //Van sessie die zojuist is aangemaakt, status wijzigen naar "Cancelled" via edit page en opslaan
  await listPage.editSessionByClickOnTitle(scenarioContextAddedSessions.title);
  await editPage.assertSessionData(scenarioContextAddedSessions);
  await editPage.fieldStatus.selectOption(SESSION_STATUS.CANCELLED);
  await editPage.saveChanges();

  //Controleren of je op de list page bent en sessie niet meer in de lijst staat
  await editPage.assertUpdateFailedMessage();
});

//Let op --> In ideale situatie begin je bij onderstaande tests met een vooraf vastgestelde dataset zodat je niet afhankelijk bent van data die al in het systeem staat.
test("8. Een sessie kan succesvol worden gefilterd op title, gefilterde titels bevatten de filterwaarde", async ({ listPage}) => {
  //Krijg alle data zichtbaar op de list page voordat je gaat filteren
  await listPage.clearFilters();
  const unfilteredSessions = await listPage.getAllVisibleSessions();

  //Filteren in FE op title, sla deze data op, expliciet testen dat alle titels van gefilterde sessies de filterwaarde bevatten
  const filterValue = "training";
  await listPage.filterByTitle(filterValue);
  const filteredSessions = await listPage.getAllVisibleSessions();
  
  //Gefilterde sessies hebben allemaal de title die gelijk is aan de filterwaarde
  await listPage.expectAllVisibleSessionsMatchFilters(filteredSessions, [ { filterType: FILTER_TYPE.TITLE, value: filterValue } ]);

  //Filter de onbewerkte sessies op dezelfde waarde als waarop je gefilterd hebt in de UI en toets dat het resultaat gelijk is aan elkaar
  const expectedFilteredSessions = unfilteredSessions.filter(s => s.title.trim().toLowerCase().includes(filterValue.trim().toLowerCase()));
  expect(filteredSessions).toEqual(expectedFilteredSessions);

  //Clear filters and check if all sessions are visible again
  await listPage.clearFilters();
  const allSessionsAfterClearingFilters = await listPage.getAllVisibleSessions();
  expect(allSessionsAfterClearingFilters).toEqual(unfilteredSessions);
});

test("9. Een sessie kan succesvol worden gefilterd op duration, gefilterde durations bevatten de filterwaarde", async ({ listPage}) => {
  //Krijg alle data zichtbaar op de list page voordat je gaat filteren
  await listPage.clearFilters();
  const unfilteredSessions = await listPage.getAllVisibleSessions();

  //Filteren in FE op duration, sla deze data op, expliciet testen dat alle durations van gefilterde sessies gelijk zijn aan de filterwaarde
  const filterValue = "3.5";
  await listPage.filterByDuration(filterValue);
  const filteredSessions = await listPage.getAllVisibleSessions();

  //Gefilterde sessies hebben allemaal de duration die gelijk is aan de filterwaarde
  await listPage.expectAllVisibleSessionsMatchFilters(filteredSessions, [ { filterType: FILTER_TYPE.DURATION, value: filterValue } ]);

  //Filter de onbewerkte sessies op dezelfde waarde als waarop je gefilterd hebt in de UI en toets dat het resultaat gelijk is aan elkaar
  const expectedFilteredSessions = unfilteredSessions.filter(s => s.durationHours === parseFloat(filterValue));
  expect(filteredSessions).toEqual(expectedFilteredSessions);

  //Clear filters and check if all sessions are visible again
  await listPage.clearFilters();
  const allSessionsAfterClearingFilters = await listPage.getAllVisibleSessions();
  expect(allSessionsAfterClearingFilters).toEqual(unfilteredSessions);
});

test("10. Een sessie kan succesvol worden gefilterd op status, gefilterde statussen zijn gelijk aan de filterwaarde", async ({ listPage}) => {
  //Krijg alle data zichtbaar op de list page voordat je gaat filteren
  await listPage.clearFilters();
  const unfilteredSessions = await listPage.getAllVisibleSessions();

  //Filteren in FE op duration, sla deze data op
  const filterValue = SESSION_STATUS.COMPLETED;
  await listPage.filterByStatus(filterValue);
  const filteredSessions = await listPage.getAllVisibleSessions();

  //Gefilterde sessies hebben allemaal de status die gelijk is aan de filterwaarde
  await listPage.expectAllVisibleSessionsMatchFilters(filteredSessions, [ { filterType: FILTER_TYPE.STATUS, value: filterValue } ] );

  //Filter de onbewerkte sessies op dezelfde waarde als waarop je gefilterd hebt in de UI en toets dat het resultaat gelijk is aan elkaar
  const expectedFilteredSessions = unfilteredSessions.filter(s => s.status === filterValue);
  expect(filteredSessions).toEqual(expectedFilteredSessions);

  //Clear filters and check if all sessions are visible again
  await listPage.clearFilters();
  const allSessionsAfterClearingFilters = await listPage.getAllVisibleSessions();
  expect(allSessionsAfterClearingFilters).toEqual(unfilteredSessions);
});

test("11. Filter op titel, duration en status toont correcte resultaatsamenvatting met aantal, totaal en zoekterm", async ({ listPage}) => {
  //Krijg alle data zichtbaar op de list page voordat je gaat filteren
  await listPage.clearFilters();
  const unfilteredSessions = await listPage.getAllVisibleSessions();

  //Filteren op title & assertion resultaatsamenvatting
  const titleFilterValue = "test";
  await listPage.filterByTitle(titleFilterValue);
  const filteredOnTitleSessions = await listPage.getAllVisibleSessions();
  const expectedSummaryTextTitle = await listPage.buildExpectedSessionsSummaryText(listPage, { shown: filteredOnTitleSessions.length, total: unfilteredSessions.length, filters: [{ filterType: FILTER_TYPE.TITLE, value: titleFilterValue }] });
  const actualSummaryTextTitle = await listPage.getActualSessionsSummaryText();
  expect(actualSummaryTextTitle).toBe(expectedSummaryTextTitle);

  //Filteren op duration & assertion resultaatsamenvatting
  await listPage.clearFilters();
  const durationFilterValue = "2.5";
  await listPage.filterByDuration(durationFilterValue);
  const filteredOnDurationSessions = await listPage.getAllVisibleSessions();
  const expectedSummaryTextDuration = await listPage.buildExpectedSessionsSummaryText(listPage, { shown: filteredOnDurationSessions.length, total: unfilteredSessions.length, filters: [{ filterType: FILTER_TYPE.DURATION, value: durationFilterValue }] });
  const actualSummaryTextDuration = await listPage.getActualSessionsSummaryText();
  expect(actualSummaryTextDuration).toBe(expectedSummaryTextDuration);

  //Filteren op status & assertion resultaatsamenvatting
  await listPage.clearFilters();
  const statusFilterValue = SESSION_STATUS.COMPLETED;
  await listPage.filterByStatus(statusFilterValue);
  const filteredOnStatusSessions = await listPage.getAllVisibleSessions();
  const expectedSummaryTextStatus = await listPage.buildExpectedSessionsSummaryText(listPage, { shown: filteredOnStatusSessions.length, total: unfilteredSessions.length, filters: [{ filterType: FILTER_TYPE.STATUS, value: statusFilterValue }] });
  const actualSummaryTextStatus = await listPage.getActualSessionsSummaryText();
  expect(actualSummaryTextStatus).toBe(expectedSummaryTextStatus);

  //Filteren op alle drie & assertion resultaatsamenvatting
  await listPage.clearFilters();
  await listPage.filterByTitle(titleFilterValue);
  await listPage.filterByDuration(durationFilterValue);
  await listPage.filterByStatus(statusFilterValue);

  const filteredOnAllCriteriaSessions = await listPage.getAllVisibleSessions();

  //Gefilterde sessies hebben allemaal de title, duration en status die gelijk is aan de filterwaarde
  await listPage.expectAllVisibleSessionsMatchFilters(
    filteredOnAllCriteriaSessions,
    [ 
      { filterType: FILTER_TYPE.TITLE, value: titleFilterValue },
      { filterType: FILTER_TYPE.DURATION, value: durationFilterValue },
      { filterType: FILTER_TYPE.STATUS, value: statusFilterValue }, 
    ]
  );

  const expectedSummaryTextAllCriteria =
    await listPage.buildExpectedSessionsSummaryText(listPage, {
      shown: filteredOnAllCriteriaSessions.length,
      total: unfilteredSessions.length,
      filters: [
        { filterType: FILTER_TYPE.TITLE, value: titleFilterValue},
        { filterType: FILTER_TYPE.DURATION, value: durationFilterValue},
        { filterType: FILTER_TYPE.STATUS, value: statusFilterValue},
      ],
    });
  const actualSummaryTextAllCriteria = await listPage.getActualSessionsSummaryText();
  expect(actualSummaryTextAllCriteria).toBe(expectedSummaryTextAllCriteria);

  //Clear filters and check if all sessions are visible again
  await listPage.clearFilters();
  const allSessionsAfterClearingFilters = await listPage.getAllVisibleSessions();
  expect(allSessionsAfterClearingFilters).toEqual(unfilteredSessions);
});


});
