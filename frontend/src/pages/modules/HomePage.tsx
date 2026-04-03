import HomePageContent from '../../components/home/HomePageContent';
import { useHomePage } from '../../hooks/modules/useHomePage';

export default function HomePage() {
    const pageModel = useHomePage();

    return (
        <HomePageContent
            home={pageModel.home}
            loading={pageModel.loading}
            refreshing={pageModel.refreshing}
            error={pageModel.error}
            feedback={pageModel.feedback}
            token={pageModel.token}
            isStaff={pageModel.isStaff}
            search={pageModel.search}
            onSearchChange={pageModel.handleSearchChange}
            categoryOptions={pageModel.categoryOptions}
            authorOptions={pageModel.authorOptions}
            yearOptions={pageModel.yearOptions}
            bannerText={pageModel.bannerText}
            searchPlaceholder={pageModel.searchPlaceholder}
            latestBooksCount={pageModel.latestBooks.length}
            popularBooksCount={pageModel.popularBooks.length}
            filteredBooks={pageModel.filteredBooks}
            booksPerPage={pageModel.booksPerPage}
            bookPage={pageModel.bookPage}
            totalBookPages={pageModel.totalBookPages}
            pagedBooks={pageModel.pagedBooks}
            selectedBorrowBook={pageModel.selectedBorrowBook}
            borrowDialogOpen={pageModel.borrowDialogOpen}
            borrowSubmitting={pageModel.borrowSubmitting}
            borrowDialogError={pageModel.borrowDialogError}
            queueNoticeOpen={pageModel.queueNoticeOpen}
            queueNoticeMessage={pageModel.queueNoticeMessage}
            pickupDate={pageModel.pickupDate}
            returnDate={pageModel.returnDate}
            primaryAction={pageModel.primaryAction}
            secondaryAction={pageModel.secondaryAction}
            onBookPageChange={pageModel.setBookPage}
            onSearchQueryChange={(value) => pageModel.handleSearchChange('q', value)}
            onBorrowSlipClose={pageModel.closeBorrowSlip}
            onBorrowSlipConfirm={() => { void pageModel.confirmBorrowSlip(); }}
            onBorrowDateChange={{ pickup: pageModel.setPickupDate, return: pageModel.setReturnDate }}
            onQueueNoticeClose={() => pageModel.setQueueNoticeOpen(false)}
            onBorrow={pageModel.openBorrowSlip}
            onWaitlist={(bookId) => { void pageModel.handleWaitlist(bookId); }}
        />
    );
}