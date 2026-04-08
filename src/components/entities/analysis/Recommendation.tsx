// рекомендации
import {RecommendationResult} from "../../../models/interfaces/RecommendationResult";
import {Badge} from "react-bootstrap";

const Recommendation = (
    {recommendation}:{recommendation:RecommendationResult}) =>
      <div className="mt-2">
          <Badge className="mb-2" bg="success">
              Рекомендации
          </Badge>
          <p className="fw-semibold">{recommendation.text}</p>
          <p className="text-muted small">{recommendation.description}</p>
          <p className="text-primary small">{recommendation.action}</p>
      </div>;
export default Recommendation;