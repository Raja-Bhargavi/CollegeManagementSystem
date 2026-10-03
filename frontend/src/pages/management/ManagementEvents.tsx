import ManagementModulePage from "./ManagementModulePage";

function ManagementEvents() {
    return (
        <ManagementModulePage
            title="Events"
            description="View institutional events, schedules, and event information."
            endpoint="/events"
        />
    );
}

export default ManagementEvents;