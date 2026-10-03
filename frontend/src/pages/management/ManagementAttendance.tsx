import ManagementModulePage from "./ManagementModulePage";

function ManagementAttendance() {
    return (
        <ManagementModulePage
            title="Attendance"
            description="View institutional attendance records and academic attendance information."
            endpoint="/attendance"
        />
    );
}

export default ManagementAttendance;