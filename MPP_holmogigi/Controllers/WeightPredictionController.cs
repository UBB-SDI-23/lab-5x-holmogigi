using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using Microsoft.ML;
using Microsoft.ML.Data;
using Microsoft.AspNetCore.Authorization;
using System.IO.Compression;
using Org.BouncyCastle.Utilities.Zlib;
using static MPP.MLModel;

namespace MPP.Controllers
{
    [Route("api/AiModel")]
    [ApiController]
    public class WeightPredictionController : ControllerBase
    {
        public class WeightPredictionData
        {
            [ColumnName("division")]
            public string Division { get; set; }

            [ColumnName("age")]
            public int Age { get; set; }
        }

        // Define a class to hold the prediction result
        public class WeightPredictionResult
        {
            public int Prediction { get; set; }
        }

        [HttpGet("{division}/{age}/{height}")]
        [AllowAnonymous]
        public IActionResult GetWeightPrediction(string division, int age, int height)
        {
            // Load sample data
            var sampleData = new MLModel.ModelInput()
            {
                Division = division,
                Age = age,
                Height = height
            };

            int weight = (int)MLModel.Predict(sampleData).Score;

            return Ok(weight);
        }
    }
}