import { Container, PageHeader } from "@/components/common";
import { TasksContainer } from "@/features/tasks";

export default function TasksPage() {
  return (
    <Container>
      <PageHeader
        title="Tasks"
        description="Manage and track your tasks efficiently"
      />
      <TasksContainer />
    </Container>
  );
}
