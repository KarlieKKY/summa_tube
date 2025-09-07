import { Clock, FileText, Share2 } from "lucide-react";

const FeaturesSection = () => (
  <div className="grid md:grid-cols-3 gap-8 mt-12">
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Clock className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Save Time</h3>
      <p className="text-gray-600">
        Get key insights from hours of content in just minutes
      </p>
    </div>
    <div className="text-center">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FileText className="w-6 h-6 text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Smart Summaries
      </h3>
      <p className="text-gray-600">
        AI-powered extraction of the most important information
      </p>
    </div>
    <div className="text-center">
      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Share2 className="w-6 h-6 text-purple-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy Sharing</h3>
      <p className="text-gray-600">
        Export and share summaries with your team or friends
      </p>
    </div>
  </div>
);

export default FeaturesSection;
