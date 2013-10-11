/*********************************************
 *  Copyright (c) 2013 AnsibleWorks, Inc.
 *
 * JobStatus.js 
 *
 * Dashboard widget showing object counts and license availability.
 *
 */

angular.module('JobStatusWidget', ['RestServices', 'Utilities'])
    .factory('JobStatus', ['$rootScope', '$compile', 'Rest', 'GetBasePath', 'ProcessErrors', 'Wait',
    function($rootScope, $compile, Rest, GetBasePath, ProcessErrors, Wait) {
    return function(params) {
        
        var scope = $rootScope.$new();
        var jobCount, jobFails, inventoryCount, inventoryFails, groupCount, groupFails, hostCount, hostFails; 
        var counts = 0;
        var expectedCounts = 8;
        var target = params.target;        

        if (scope.removeCountReceived) {
           scope.removeCountReceived();
        }
        scope.removeCountReceived = scope.$on('CountReceived', function() {

            var rowcount = 0;

            function makeRow(label, count, fail) {
                var html = '';
                html += "<tr>\n";
                html += "<td><a href=\"/#/" + label.toLowerCase() + "\">"  + label + "</a></td>\n";
                html += "<td class=\"failed-column text-right\">";
                html += (fail > 0) ? "<a href=\"/blah/blah\">" + fail + "</a>" : ""; 
                html += "</td>\n";
                html += "<td class=\"text-right\">"
                html += (count > 0) ? "<a href=\"/blah/blah\">" + count + "</a>" : "";
                html += "</td></tr>\n";
                return html; 
                }

            counts++;
            if (counts == expectedCounts) {
               // all the counts came back, now generate the HTML 
               var html = "<div class=\"panel panel-default\">\n";
               html += "<div class=\"panel-heading\">Job Status</div>\n";
               html += "<div class=\"panel-body\">\n";
               html += "<table class=\"table table-condensed table-hover\">\n";
               html += "<thead>\n";
               html += "<tr>\n";
               html += "<th class=\"col-md-4 col-lg-3\"></th>\n";
               html += "<th class=\"col-md-2 col-lg-1 text-right\">Failed</th>\n";
               html += "<th class=\"col-md-2 col-lg-1 text-right\">Total</th>\n";
               html += "</tr>\n";
               html += "</thead>\n";
               html += "<tbody>\n";

               if (jobCount > 0) {
                  html += makeRow('Jobs', jobCount, jobFails);
                  rowcount++;
               }
               if (inventoryCount > 0) {
                  html += makeRow('Inventories', inventoryCount, inventoryFails);
                  rowcount++;
               }
               if (groupCount > 0) {
                  html += makeRow('Groups', groupCount, groupFails);
                  rowcount++;
               }
               if (hostCount > 0) {
                  html += makeRow('Hosts', hostCount, hostFails);
                  rowcount++;
               }
              
               if (rowcount == 0) {
                  html += "<tr><td colspan=\"3\">No job data found</td></tr>\n";
               }

               html += "</tbody>\n";
               html += "</table>\n";
               html += "</div>\n";
               html += "</div>\n";
               html += "</div>\n";

               var element = angular.element(document.getElementById(target));
               element.html(html);
               $compile(element)(scope);
               $rootScope.$emit('WidgetLoaded');
            }
            });

        var url = GetBasePath('jobs') + '?page=1';
        Rest.setUrl(url);
        Rest.get()
            .success( function(data, status, headers, config) {
                jobCount=data.count;
                scope.$emit('CountReceived');
                })
            .error( function(data, status, headers, config) {
                ProcessErrors(scope, data, status, null,
                    { hdr: 'Error!', msg: 'Failed to get ' + url + '. GET status: ' + status });
                });

        url = GetBasePath('jobs') + '?failed=true&page=1';
        Rest.setUrl(url);
        Rest.get()
            .success( function(data, status, headers, config) {
                jobFails=data.count;
                scope.$emit('CountReceived');
                })
            .error( function(data, status, headers, config) {
                ProcessErrors(scope, data, status, null,
                    { hdr: 'Error!', msg: 'Failed to get ' + url + '. GET status: ' + status });
                });

        url = GetBasePath('inventory') + '?page=1';
        Rest.setUrl(url);
        Rest.get()
            .success( function(data, status, headers, config) {
                inventoryCount=data.count;
                scope.$emit('CountReceived');
                })
            .error( function(data, status, headers, config) {
                ProcessErrors(scope, data, status, null,
                    { hdr: 'Error!', msg: 'Failed to get ' + url + '. GET status: ' + status });
                });

        url = GetBasePath('inventory') + '?has_active_failures=true&page=1';
        Rest.setUrl(url);
        Rest.get()
            .success( function(data, status, headers, config) {
                inventoryFails=data.count;
                scope.$emit('CountReceived');
                })
            .error( function(data, status, headers, config) {
                ProcessErrors(scope, data, status, null,
                    { hdr: 'Error!', msg: 'Failed to get ' + url + '. GET status: ' + status });
                });

        url = GetBasePath('groups') + '?page=1';
        Rest.setUrl(url);
        Rest.get()
            .success( function(data, status, headers, config) {
                groupCount = data.count;
                scope.$emit('CountReceived');
                })
            .error( function(data, status, headers, config) {
                ProcessErrors(scope, data, status, null,
                    { hdr: 'Error!', msg: 'Failed to get ' + url + '. GET status: ' + status });
                });

        url = GetBasePath('groups') + '?has_active_failures=true&page=1';
        Rest.setUrl(url);
        Rest.get()
            .success( function(data, status, headers, config) {
                groupFails = data.count;
                scope.$emit('CountReceived');
                })
            .error( function(data, status, headers, config) {
                ProcessErrors(scope, data, status, null,
                    { hdr: 'Error!', msg: 'Failed to get ' + url + '. GET status: ' + status });
                });

        url = GetBasePath('hosts') + '?page=1';
        Rest.setUrl(url);
        Rest.get()
            .success( function(data, status, headers, config) {
                hostCount = data.count;
                scope.$emit('CountReceived');
                })
            .error( function(data, status, headers, config) {
                ProcessErrors(scope, data, status, null,
                    { hdr: 'Error!', msg: 'Failed to get ' + url + '. GET status: ' + status });
                });

        url = GetBasePath('hosts') + '?has_active_failures=true&page=1';
        Rest.setUrl(url);
        Rest.get()
            .success( function(data, status, headers, config) {
                hostFails = data.count;
                scope.$emit('CountReceived');
                })
            .error( function(data, status, headers, config) {
                ProcessErrors(scope, data, status, null,
                    { hdr: 'Error!', msg: 'Failed to get ' + url + '. GET status: ' + status });
                });

        }
        }]);
