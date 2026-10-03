import ManagementModulePage from "./ManagementModulePage";

function ManagementExaminations() {
    return (
        <ManagementModulePage
            title="Examinations"
            description="View examination schedules, subjects, and examination information."
            endpoint="/examinations"
        />
    );
}

export default ManagementExaminations;