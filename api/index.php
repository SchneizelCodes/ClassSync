<?php
declare(strict_types=1);

require __DIR__ . '/centralized_database.php';

header('Content-Type: application/json');

$action = $_GET['action'] ?? 'dashboard';
$db = centralized_db();

switch ($action) {
    case 'dashboard':
        echo json_encode($db->getDashboardOverview());
        break;
    case 'instructors':
        echo json_encode($db->getInstructorProfiles());
        break;
    case 'schedules':
        echo json_encode($db->getSchedules());
        break;
    case 'attendance':
        echo json_encode($db->getAttendance());
        break;
    case 'reports':
        echo json_encode($db->getReports());
        break;
    case 'log-attendance':
        $payload = json_decode(file_get_contents('php://input'), true) ?? [];
        echo json_encode($db->logAttendance($payload));
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Unknown action.']);
        break;
}
