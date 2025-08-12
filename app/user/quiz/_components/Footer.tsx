import { Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-yellow-200 dark:bg-yellow-700 mt-auto">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center text-center">
          <Phone className="h-5 w-5 mr-2 text-yellow-800 dark:text-yellow-200" />
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            In case of any Errors or Problems, please contact us on:{' '}
            <a href="tel:9693690545" className="font-medium text-blue-600 hover:underline">
              96936 90545
            </a>{' '}
            or{' '}
            <a href="tel:9935620054" className="font-medium text-blue-600 hover:underline">
              99356 20054
            </a>{' '}
            or{' '}
            <a href="tel:9335101824" className="font-medium text-blue-600 hover:underline">
              93351 01824
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}