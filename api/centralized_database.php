<?php
declare(strict_types=1);

final class CentralizedDatabase
{
    private array $instructors;
    private array $schedules;
    private array $attendance;
    private array $dashboard;

    public function __construct()
    {
        $this->dashboard = [
            'active_sessions' => 14,
            'rooms_allocated' => 28,
            'conflicts' => 2,
            'synced_at' => '2026-03-11 09:15:00',
        ];

        $this->instructors = [
            [
                'id' => 'INS-001',
                'name' => 'Richard Vienna Dela Cruz',
                'department' => 'College of Engineering',
                'load_units' => 18,
                'status' => 'Full-time',
            ],
            [
                'id' => 'INS-002',
                'name' => 'Benjamin Molinar',
                'department' => 'College of Computer Studies',
                'load_units' => 12,
                'status' => 'Part-time',
            ],
        ];

        $this->schedules = [
            [
                'subject' => 'IPT101',
                'room' => 'IK604',
                'day' => 'Mon',
                'time' => '08:00-10:00',
                'instructor' => 'Richard Vienna Dela Cruz',
            ],
            [
                'subject' => 'IM101',
                'room' => 'IL703',
                'day' => 'Tue',
                'time' => '10:00-12:00',
                'instructor' => 'Benjamin Molinar',
            ],
        ];

        $this->attendance = [
            [
                'session' => 'IPT101',
                'date' => '2026-03-11',
                'student_id' => '20240102',
                'status' => 'Present',
            ],
            [
                'session' => 'IPT101',
                'date' => '2026-03-11',
                'student_id' => '20240119',
                'status' => 'Late',
            ],
        ];
    }

    public function getDashboardOverview(): array
    {
        return $this->dashboard;
    }

    public function getInstructorProfiles(): array
    {
        return $this->instructors;
    }

    public function getSchedules(): array
    {
        return $this->schedules;
    }

    public function getAttendance(): array
    {
        return $this->attendance;
    }

    public function logAttendance(array $payload): array
    {
        return [
            'status' => 'ok',
            'message' => 'Attendance logged (mock).',
            'payload' => $payload,
        ];
    }

    public function getReports(): array
    {
        return [
            'weekly_attendance_average' => 0.92,
            'scheduled_classes' => 48,
            'last_generated' => '2026-03-08',
        ];
    }
}

function centralized_db(): CentralizedDatabase
{
    static $instance = null;
    if ($instance === null) {
        $instance = new CentralizedDatabase();
    }
    return $instance;
}
