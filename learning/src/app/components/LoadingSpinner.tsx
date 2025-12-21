import { Card, CardContent } from '@nx-micros/ui';

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Loading...</span>
    </div>
  );
}

export function LoadingCard() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <LoadingSpinner />
      </CardContent>
    </Card>
  );
}
