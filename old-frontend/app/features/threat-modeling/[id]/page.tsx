// Threat model detail
export default async function ThreatModelDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>Threat Model {id}</div>;
}