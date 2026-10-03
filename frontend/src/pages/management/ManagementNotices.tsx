import ManagementModulePage from "./ManagementModulePage";

function ManagementNotices() {
    return (
        <ManagementModulePage
            title="Notices"
            description="View institutional notices and official announcements."
            endpoint="/notices"
        />
    );
}

export default ManagementNotices;